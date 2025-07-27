import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository'
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit'
import { PrismaMedicineExitMapper } from '../mappers/prisma-medicine-exit-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-exit-details'
import { $Enums, Prisma } from 'prisma/generated'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Movimentation } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details'

@Injectable()
export class PrismaMedicinesExitsRepository
implements MedicinesExitsRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineExit: MedicineExit): Promise<void> {
    const data = PrismaMedicineExitMapper.toPrisma(medicineExit)
    await this.prisma.exit.create({
      data,
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      institutionId?: string;
      medicineId?: string;
      operatorId?: string;
      batch?: string;
      exitType?: ExitType;
      exitDate?: Date;
      movementTypeId?: string;
    },
  ): Promise<{ medicinesExits: MedicineExitDetails[]; meta: Meta }> {
    const {
      batch,
      exitDate,
      exitType,
      institutionId,
      medicineId,
      movementTypeId,
      operatorId,
    } = filters

    const whereClause: Prisma.ExitWhereInput = {
      batchestock: {
        ...(batch && {
          batch: {
            code: {
              equals: batch,
              mode: 'insensitive',
            },
          },
        }),
        ...(institutionId && {
          stock: {
            institutionId: { equals: institutionId },
          },
        }),
      },
      ...(exitDate && {
        exitDate: {
          lte: exitDate,
          gte: exitDate,
        },
      }),
      ...(exitType && {
        exitType: { equals: exitType },
      }),
      ...(medicineId && {
        medicineStock: {
          medicineVariant: {
            medicineId: { equals: medicineId },
          },
        },
      }),
      ...(movementTypeId && {
        movementTypeId: { equals: movementTypeId },
      }),
      ...(operatorId && {
        operatorId: { equals: operatorId },
      }),
    }

    const [medicinesExits, totalCount] = await this.prisma.$transaction([
      this.prisma.exit.findMany({
        where: whereClause,
        take: 10,
        skip: (page - 1) * 10,
        include: {
          batchestock: {
            include: {
              batch: {
                select: {
                  code: true,
                },
              },
              stock: { select: { name: true } },
            },
          },
          medicineStock: {
            include: {
              medicineVariant: {
                select: {
                  pharmaceuticalForm: {
                    select: { name: true },
                  },
                  unitMeasure: { select: { acronym: true } },
                  medicine: { select: { name: true } },
                  dosage: true,
                },
              },
            },
          },
          movementType: {
            select: { name: true },
          },
          operator: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.exit.count({
        where: whereClause,
      }),
    ])

    const medicinesExitsMapped = medicinesExits.map((exit) => {
      return MedicineExitDetails.create({
        medicineExitId: new UniqueEntityId(exit.id),
        medicineStockId: new UniqueEntityId(exit.medicineStockId),
        batchestockId: new UniqueEntityId(exit.batchestockId),
        batch: exit.batchestock.batch.code,
        exitDate: exit.exitDate,
        exitType: ExitType[exit.exitType],
        operator: exit.operator.name,
        movementType: exit.movementType?.name,
        stock: exit.batchestock.stock.name,
        medicine: exit.medicineStock.medicineVariant.medicine.name,
        dosage: exit.medicineStock.medicineVariant.dosage,
        pharmaceuticalForm:
          exit.medicineStock.medicineVariant.pharmaceuticalForm.name,
        unitMeasure: exit.medicineStock.medicineVariant.unitMeasure.acronym,
        quantity: exit.quantity,
        updatedAt: exit.updatedAt,
        createdAt: exit.createdAt,
      })
    })

    return {
      medicinesExits: medicinesExitsMapped,
      meta: {
        page,
        totalCount,
      },
    }
  }

  async fetchMovimentation(filters: {
    institutionId: string;
    startDate: Date;
    endDate: Date;
    operatorId?: string;
    medicineId?: string;
    stockId?: string;
    medicineVariantId?: string;
    medicineStockId?: string;
    batcheStockId?: string;
    quantity?: number;
    movementTypeId?: string;
    exitType?: ExitType;
  }): Promise<{ exitsMovimentation: Movimentation[]; meta: MetaReport }> {
    const {
      endDate,
      institutionId,
      startDate,
      batcheStockId,
      exitType,
      medicineId,
      medicineStockId,
      medicineVariantId,
      movementTypeId,
      operatorId,
      quantity,
      stockId,
    } = filters

    const whereClause: Prisma.ExitWhereInput = {

      ...(quantity && { quantity: { gte: Number(quantity), lte: Number(quantity) } }),
      batchestock: {
        ...(stockId && { stockId: { equals: stockId } }),
        ...(batcheStockId && {
          id: {
            equals: batcheStockId,
          },
        }),
        ...(institutionId && {
          stock: {
            institutionId: { equals: institutionId },
          },
        }),
      },
      ...(startDate && { exitDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) } }),
      ...(endDate && { exitDate: { lte: new Date(endDate.setHours(23, 59, 59, 999)) } }),
      ...(exitType && {
        exitType: {
          equals: $Enums.ExitType[exitType],
        },
      }),
      ...(medicineId && {
        medicineStock: {
          medicineVariant: {
            medicineId: { equals: medicineId },
          },
        },
      }),

      ...(medicineVariantId && {
        medicineStock: {
          medicineVariant: {
            id: { equals: medicineVariantId },
          },
        },
      }),

      ...(medicineStockId && {
        medicineStock: {
          id: { equals: medicineStockId },
        },
      }),
      ...(movementTypeId && {
        movementTypeId: { equals: movementTypeId },
      }),
      ...(operatorId && {
        operatorId: { equals: operatorId },
      }),
    }

    const [medicinesExits, totalCount] = await this.prisma.$transaction([
      this.prisma.exit.findMany({
        where: whereClause,
        include: {
          batchestock: {
            include: {
              batch: {
                select: {
                  code: true,
                },
              },
              stock: { select: { name: true } },
            },
          },
          medicineStock: {
            include: {
              medicineVariant: {
                select: {
                  pharmaceuticalForm: {
                    select: { id: true, name: true },
                  },
                  id: true,
                  unitMeasure: { select: { acronym: true, id: true } },
                  medicine: { select: { id: true, name: true } },
                  dosage: true,
                },
              },
            },
          },
          movementType: {
            select: { name: true },
          },
          operator: {
            select: { name: true },
          },
        },
        orderBy: {
          exitDate: 'desc',
        },
      },
      ),
      this.prisma.exit.count({
        where: whereClause,
      }),
    ])

    const movimentationExitsMapped = medicinesExits.map((exit) => {
      return Movimentation.create({
        direction: 'EXIT',
        medicineStockId: new UniqueEntityId(exit.medicineStockId),
        batchStockId: new UniqueEntityId(exit.batchestockId),
        batchCode: exit.batchestock.batch.code,
        movementDate: exit.exitDate,
        exitType: ExitType[exit.exitType],
        operator: exit.operator.name,
        movementType:
          exit.exitType === 'MOVEMENT_TYPE'
            ? (exit.movementType?.name ?? '')
            : exit.exitType === 'DISPENSATION'
              ? ExitType.DISPENSATION
              : ExitType.EXPIRATION,
        stock: exit.batchestock.stock.name,
        medicine: exit.medicineStock.medicineVariant.medicine.name,
        dosage: exit.medicineStock.medicineVariant.dosage,
        pharmaceuticalForm:
          exit.medicineStock.medicineVariant.pharmaceuticalForm.name,
        unitMeasure: exit.medicineStock.medicineVariant.unitMeasure.acronym,
        quantity: exit.quantity,
        medicineId: new UniqueEntityId(exit.medicineStock.medicineVariant.medicine.id),
        medicineVariantId: new UniqueEntityId(exit.medicineStock.medicineVariant.id),
        operatorId: new UniqueEntityId(exit.operatorId),
        pharmaceuticalFormId: new UniqueEntityId(exit.medicineStock.medicineVariant.pharmaceuticalForm.id),
        stockId: new UniqueEntityId(),
        unitMeasureId: new UniqueEntityId(),
        complement: '',
        movementTypeId: new UniqueEntityId(),
      })
    })

    return {
      exitsMovimentation: movimentationExitsMapped,
      meta: {
        totalCount,
      },
    }
  }
}
