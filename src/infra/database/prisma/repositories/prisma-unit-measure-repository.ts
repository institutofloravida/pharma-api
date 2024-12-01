import { PaginationParams } from '@/core/repositories/pagination-params'
import { UnitsMeasureRepository } from '@/domain/pharma/application/repositories/units-measure-repository'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaUnitMeasureMapper } from '../mappers/prisma-unit-measure-mapper'
import type { Meta } from '@/core/repositories/meta'

@Injectable()
export class PrismaUnitsMeasureRepository implements UnitsMeasureRepository {
  constructor(private prisma: PrismaService) {}

  async create(unitMeasure: UnitMeasure) {
    const data = PrismaUnitMeasureMapper.toPrisma(unitMeasure)
    await this.prisma.unitMeasure.create({
      data,
    })
  }

  async findByContent(content: string) {
    const unitMeasure = await this.prisma.unitMeasure.findFirst({
      where: {
        name: {
          equals: content.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!unitMeasure) {
      return null
    }

    return PrismaUnitMeasureMapper.toDomain(unitMeasure)
  }

  async findByAcronym(acronym: string) {
    const unitMeasure = await this.prisma.unitMeasure.findFirst({
      where: {
        acronym: {
          equals: acronym.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!unitMeasure) {
      return null
    }

    return PrismaUnitMeasureMapper.toDomain(unitMeasure)
  }

  async findMany({ page }: PaginationParams, content?: string): Promise<{
    unitsMeasure: UnitMeasure[]
    meta: Meta
  }> {
    const pageSize = 20
    console.log('content:>>>>', content)
    const [unitsMeasure, totalCount] = await Promise.all([
      this.prisma.unitMeasure.findMany({
        where: {
          OR: [
            {
              acronym: {
                contains: content ?? '',
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: content ?? '',
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.unitMeasure.count({
        where: {
          OR: [
            {
              acronym: {
                contains: content ?? '',
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: content ?? '',
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ])

    const unitsMeasureMappered = unitsMeasure.map(PrismaUnitMeasureMapper.toDomain)

    return {
      unitsMeasure: unitsMeasureMappered,
      meta: {
        page,
        totalCount,
      },
    }
  }
}
