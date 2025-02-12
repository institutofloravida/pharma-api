import { MovementTypesRepository } from '@/domain/pharma/application/repositories/movement-type'
import {
  MovementType,
  MovementDirection,
} from '@/domain/pharma/enterprise/entities/movement-type'
import { PrismaMovementTypeMapper } from '../mappers/prisma-movement-type-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaMovementTypesRepository implements MovementTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findByContent(content: string): Promise<MovementType | null> {
    const movementType = await this.prisma.movementType.findFirst({
      where: {
        name: {
          equals: content,
          mode: 'insensitive',
        },
      },
    })

    if (!movementType) {
      return null
    }

    return PrismaMovementTypeMapper.toDomain(movementType)
  }

  async create(movementType: MovementType): Promise<void> {
    const data = PrismaMovementTypeMapper.toPrisma(movementType)
    await this.prisma.movementType.create({
      data,
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: { content?: string; direction?: MovementDirection },
  ): Promise<{ movementTypes: MovementType[]; meta: Meta }> {
    const { content, direction } = filters

    const whereClause: Prisma.MovementTypeWhereInput = {
      name: {
        contains: content ?? '',
        mode: 'insensitive',
      },
      ...(direction && {
        direction,
      }),
    }

    const [movementTypes, totalCount] = await this.prisma.$transaction([
      this.prisma.movementType.findMany({
        where: whereClause,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * 10,
      }),
      this.prisma.movementType.count({
        where: whereClause,
      }),
    ])

    return {
      movementTypes: movementTypes.map(PrismaMovementTypeMapper.toDomain),
      meta: {
        page,
        totalCount,
      },
    }
  }
}
