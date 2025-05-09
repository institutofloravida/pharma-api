import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { Operator, OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOperatorMapper } from '../mappers/prisma-operator-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Meta } from '@/core/repositories/meta'
import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution'
import { PrismaOperatorWithInstitutionsMapper } from '../mappers/prisma-operator-with-institution-mapper'
import { $Enums, type Prisma } from 'prisma/generated/prisma'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaOperatorsRepository implements OperatorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(operator: Operator): Promise<void> {
    const data = PrismaOperatorMapper.toPrisma(operator)

    const institutionsToConnect = operator.isSuperAdmin()
      ? await this.prisma.institution.findMany({ select: { id: true } })
      : []

    await this.prisma.operator.create({
      data: {
        ...data,
        ...(operator.isSuperAdmin() && {
          institutions: {
            connect: institutionsToConnect,
          },
        }),
      },
    })
  }

  async save(operator: Operator): Promise<void> {
    const data = PrismaOperatorMapper.toPrisma(operator)

    await this.prisma.operator.update({
      where: {
        id: operator.id.toString(),
      },
      data: {
        ...data,
        institutions: {
          set: operator.institutionsIds.map(item => ({ id: item.toString() })),
        },
      },
    })
  }

  async findById(id: string): Promise<Operator | null> {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: {
        institutions: true,
      },
    })

    if (!operator) return null

    return PrismaOperatorMapper.toDomain({
      ...operator,
      institutions: operator.institutions.map((inst) => ({ id: inst.id, name: inst.name })),
    })
  }

  async findByIdWithDetails(id: string): Promise<OperatorWithInstitution | null> {
    const operator = await this.prisma.operator.findUnique({
      where: {
        id,
      },
      include: {
        institutions: true,
      },
    })

    if (!operator) return null

    const operatorMapped = OperatorWithInstitution.create({
      ...operator,
      id: new UniqueEntityId(operator.id),
      role: OperatorRole[operator.role],
      institutions: operator.institutions.map(institution => {
        return {
          id: new UniqueEntityId(institution.id),
          name: institution.name,
        }
      }),
    })

    return operatorMapped
  }

  async findByEmail(email: string): Promise<Operator | null> {
    const operator = await this.prisma.operator.findUnique({
      where: { email },
      include: {
        institutions: true,
      },
    })

    if (!operator) return null

    return PrismaOperatorMapper.toDomain({
      ...operator,
      institutions: operator.institutions.map((inst) => ({ id: inst.id })),
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      name?: string
      email?: string
      institutionId?: string
      role?: OperatorRole
    },
    isSuper: boolean,
  ): Promise<{ operators: OperatorWithInstitution[]; meta: Meta }> {
    const { email, institutionId, name, role } = filters
    const whereClause: Prisma.OperatorWhereInput = {
      name: {
        contains: name ?? '',
        mode: 'insensitive',
      },
      ...(email && {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      }),
      ...(role && {
        role: {
          equals: $Enums.OperatorRole[role as keyof typeof $Enums.OperatorRole],
        },
      }),
      ...(!isSuper && {
        role: {
          not: $Enums.OperatorRole.SUPER_ADMIN,
        },
      }),
      ...(institutionId && {
        institutions: {
          some: {
            id: institutionId,
          },
        },
      }),
    }
    const [operatorsPaginated, operatorsTotalCount] = await this.prisma.$transaction([
      this.prisma.operator.findMany({
        where: whereClause,
        include: {
          institutions: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: (page - 1) * 10,
      }),
      this.prisma.operator.count({
        where: whereClause,
      }),

    ])
    return {
      operators: operatorsPaginated.map((operator) =>
        PrismaOperatorWithInstitutionsMapper.toDomain({
          ...operator,
          institutions: operator.institutions.map((inst) => ({ id: inst.id, name: inst.name })),
        }),
      ),
      meta: {
        page,
        totalCount: operatorsTotalCount,
      },
    }
  }
}
