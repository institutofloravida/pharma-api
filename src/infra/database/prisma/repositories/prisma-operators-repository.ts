import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOperatorMapper } from '../mappers/prisma-operator-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Meta } from '@/core/repositories/meta'
import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution'
import { PrismaOperatorWithInstitutionsMapper } from '../mappers/prisma-operator-with-institution-mapper'

@Injectable()
export class PrismaOperatorsRepository implements OperatorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(operator: Operator): Promise<void> {
    const data = PrismaOperatorMapper.toPrisma(operator)
    await this.prisma.operator.create({
      data,
    })
  }

  async findById(id: string): Promise<Operator | null> {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: {
        institutions: true, // Carrega as instituições relacionadas
      },
    })

    if (!operator) return null

    return PrismaOperatorMapper.toDomain({
      ...operator,
      institutions: operator.institutions.map((inst) => ({ id: inst.id, name: inst.name })),
    })
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
    content?: string,
  ): Promise<{ operators: OperatorWithInstitution[]; meta: Meta }> {
    const operatorsPaginated = await this.prisma.operator.findMany({
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
      include: {
        institutions: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      skip: (page -1) * 10,
    })

    const operatorsTotalCount = await this.prisma.operator.count({
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
    })

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
