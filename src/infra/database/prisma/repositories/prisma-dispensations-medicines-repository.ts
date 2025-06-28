import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDispensationMapper } from '../mappers/prisma-dispensation-mapper'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient'
import { Prisma } from 'prisma/generated'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

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
              gte: new Date(new Date().setDate(1)),
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
}
