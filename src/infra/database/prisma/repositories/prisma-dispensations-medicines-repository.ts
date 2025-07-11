import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import {
  Dispensation,
  type DispensationPerDay,
} from '@/domain/pharma/enterprise/entities/dispensation'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDispensationMapper } from '../mappers/prisma-dispensation-mapper'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient'
import { Prisma } from 'prisma/generated'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MostTreatedPathology } from '@/domain/pharma/enterprise/entities/pathology'

@Injectable()
export class PrismaDispensationsMedicinesRepository
implements DispensationsMedicinesRepository {
  constructor(private prisma: PrismaService) {}

  async create(dispensation: Dispensation): Promise<void> {
    const data = PrismaDispensationMapper.toPrisma(dispensation)
    await this.prisma.dispensation.create({
      data,
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: { patientId?: string; dispensationDate?: Date },
  ): Promise<{ dispensations: DispensationWithPatient[]; meta: Meta }> {
    const { patientId, dispensationDate } = filters

    const whereClause: Prisma.DispensationWhereInput = {
      ...(patientId && { patientId: { equals: patientId } }),
      ...(dispensationDate && {
        dispensationDate: {
          gte: new Date(dispensationDate.setHours(0, 0, 0, 0)), // Início do dia
          lte: new Date(dispensationDate.setHours(23, 59, 59, 999)), // Fim do dia
        },
      }),
    }

    const [dispensations, totalCount] = await this.prisma.$transaction([
      this.prisma.dispensation.findMany({
        where: whereClause,
        take: 10,
        skip: (Math.max(1, page) - 1) * 10,
        include: {
          operator: { select: { id: true, name: true } },
          patient: { select: { id: true, name: true } },
          exitRecords: {
            select: { medicineStockId: true },
            distinct: ['medicineStockId'],
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dispensation.count({ where: whereClause }),
    ])

    const dispensationsMapped = dispensations.map((dispensation) => {
      return DispensationWithPatient.create({
        dispensationDate: dispensation.dispensationDate,
        dispensationId: new UniqueEntityId(dispensation.id),
        operator: dispensation.operator.name,
        operatorId: new UniqueEntityId(dispensation.operator.id),
        patientId: new UniqueEntityId(dispensation.patient.id),
        patient: dispensation.patient.name,
        items: dispensation.exitRecords.length,
      })
    })

    return {
      dispensations: dispensationsMapped,
      meta: {
        page,
        totalCount,
      },
    }
  }

  async getDispensationMetrics(institutionId: string): Promise<{
    today: { total: number; percentageAboveAverage: number };
    month: { total: number; percentageComparedToLastMonth: number };
  }> {
    const now = new Date()
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    )

    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const endOfToday = new Date(today.setHours(23, 59, 59, 999))
    const [todayCount, monthCount, lastMonthCount] =
      await this.prisma.$transaction([
        this.prisma.dispensation.count({
          where: {
            exitRecords: {
              some: {
                batchestock: {
                  stock: {
                    institutionId,
                  },
                },
              },
            },
            dispensationDate: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),
        this.prisma.dispensation.count({
          where: {
            exitRecords: {
              some: {
                batchestock: {
                  stock: {
                    institutionId,
                  },
                },
              },
            },
            dispensationDate: {
              gte: startOfMonth,
            },
          },
        }),
        this.prisma.dispensation.count({
          where: {
            exitRecords: {
              some: {
                batchestock: {
                  stock: {
                    institutionId,
                  },
                },
              },
            },
            dispensationDate: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
              lt: new Date(new Date().setMonth(new Date().getMonth(), 1)),
            },
          },
        }),
      ])

    const averageLastMonth = lastMonthCount > 0
      ? lastMonthCount / 30
      : 0

    return {
      today: {
        total: todayCount,
        percentageAboveAverage:
          averageLastMonth > 0
            ? ((todayCount - averageLastMonth) / averageLastMonth) * 100
            : 0,
      },
      month: {
        total: monthCount,
        percentageComparedToLastMonth:
          lastMonthCount > 0
            ? ((monthCount - lastMonthCount) / lastMonthCount) * 100
            : 0,
      },
    }
  }

  async getDispensationsInAPeriod(
    institutionId: string,
    startDate?: Date,
    endDate?: Date,
    patientId?: string,
    operatorId?: string,
  ): Promise<{ dispensations: DispensationWithPatient[]; meta: MetaReport }> {
    const whereClause: Prisma.DispensationWhereInput = {
      exitRecords: {
        some: {
          batchestock: {
            stock: {
              institutionId: { equals: institutionId },
            },
          },
        },
      },
      ...(startDate && { dispensationDate: { gte: startDate } }),
      ...(endDate && { dispensationDate: { lte: endDate } }),
      ...(patientId && { patientId: { equals: patientId } }),
      ...(operatorId && { operatorId: { equals: operatorId } }),
    }

    const [dispensations, totalCount] = await this.prisma.$transaction([
      this.prisma.dispensation.findMany({
        where: whereClause,
        include: {
          operator: { select: { id: true, name: true } },
          patient: { select: { id: true, name: true } },
          exitRecords: {
            select: { medicineStockId: true },
            distinct: ['medicineStockId'],
          },
        },
        orderBy: { dispensationDate: 'desc' },
      }),
      this.prisma.dispensation.count({ where: whereClause }),
    ])

    const dispensationsMapped = dispensations.map((dispensation) => {
      return DispensationWithPatient.create({
        dispensationDate: dispensation.dispensationDate,
        dispensationId: new UniqueEntityId(dispensation.id),
        operator: dispensation.operator.name,
        operatorId: new UniqueEntityId(dispensation.operator.id),
        patientId: new UniqueEntityId(dispensation.patient.id),
        patient: dispensation.patient.name,
        items: dispensation.exitRecords.length,
      })
    })

    return {
      dispensations: dispensationsMapped,
      meta: {
        totalCount,
      },
    }
  }

  async fetchDispensesPerDay(
    institutionId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ dispenses: DispensationPerDay[]; meta: MetaReport }> {
    const whereClause: Prisma.DispensationWhereInput = {
      exitRecords: {
        some: {
          batchestock: {
            stock: {
              institutionId: { equals: institutionId },
            },
          },
        },
      },
      dispensationDate: { gte: startDate, lte: endDate },
    }

    const totalCount = await this.prisma.dispensation.count({
      where: whereClause,
    })
    const dispensesGroupedByDay = await this.prisma.dispensation.groupBy({
      by: ['dispensationDate'],
      where: whereClause,
      _count: {
        _all: true,
      },
      orderBy: {
        dispensationDate: 'asc',
      },
    })

    const dispensesPerDay: DispensationPerDay[] = dispensesGroupedByDay.map(
      (group) => ({
        dispensationDate: group.dispensationDate,
        total: group._count._all,
      }),
    )

    return {
      dispenses: dispensesPerDay,
      meta: {
        totalCount,
      },
    }
  }

  async fetchMostTreatedPathologies(
    institutionId?: string,
  ): Promise<{ mostTreatedPathologies: MostTreatedPathology[] }> {
    const whereClause = institutionId
      ? `WHERE s."institution_id" = '${institutionId}'`
      : ''
    const pathologies = await this.prisma.$queryRawUnsafe<
      Array<{ pathologyId: string; pathologyName: string; total: number }>
    >(
      `SELECT
        p.id AS "pathologyId",
        p.name AS "pathologyName",
        COUNT(*) AS total
      FROM "pathology" p
      JOIN "_PathologyToPatient" pp ON pp."A" = p.id
      JOIN "patients" pa ON pa.id = pp."B"
      JOIN "dispensations" d ON d."patient_id" = pa.id
      JOIN "exits" e ON e."dispensationId" = d.id
      JOIN "batches_stocks" bs ON bs.id = e."batchestockId"
      JOIN "stocks" s ON s.id = bs."stock_id"
      ${whereClause}
      GROUP BY p.id, p.name
      ORDER BY total DESC`,
    )

    const totalDispensations = pathologies.reduce(
      (sum, p) => sum + Number(p.total),
      0,
    )
    const top4 = pathologies.slice(0, 4).map((p) => ({
      ...p,
      total: Number(p.total),
      percentage:
        totalDispensations > 0
          ? (Number(p.total) / totalDispensations) * 100
          : 0,
    }))
    const othersTotal = pathologies
      .slice(4)
      .reduce((sum, p) => sum + Number(p.total), 0)
    const othersPercentage =
      totalDispensations > 0
        ? (othersTotal / totalDispensations) * 100
        : 0

    const result: MostTreatedPathology[] = [...top4]
    if (othersTotal > 0) {
      result.push({
        pathologyId: 'others',
        pathologyName: 'Outros',
        total: othersTotal,
        percentage: othersPercentage,
      })
    }

    return { mostTreatedPathologies: result }
  }
}
