import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOperatorMapper } from '../mappers/prisma-operator-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Meta } from '@/core/repositories/meta'

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
      where: {
        id,
      },
      include: {
        institutions: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!operator) {
      return null
    }

    return PrismaOperatorMapper.toDomain(operator)
  }

  async findByEmail(email: string): Promise<Operator | null> {
    const operator = await this.prisma.operator.findUnique({
      where: {
        email,
      },
      include: {
        institutions: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!operator) {
      return null
    }

    return PrismaOperatorMapper.toDomain(operator)
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ operators: Operator[]; meta: Meta }> {
    const operatorsPaginated = await this.prisma.operator.findMany({
      where: {
        name: {
          contains: content ?? '',
          mode: 'insensitive',
        },
      },
      include: {
        institutions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
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
      operators: operatorsPaginated.map(PrismaOperatorMapper.toDomain),
      meta: {
        page,
        totalCount: operatorsTotalCount,
      },
    }
  }
}
