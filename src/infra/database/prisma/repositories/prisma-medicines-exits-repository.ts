import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository'
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit'
import { PrismaMedicineExitMapper } from '../mappers/prisma-medicine-exit-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Prisma } from 'prisma/generated'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details'

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
      institutionId: string;
      operatorId?: string;
      exitType?: ExitType;
      exitDate?: Date;
    },
  ): Promise<{ medicinesExits: ExitDetails[]; meta: Meta }> {
    const {
      exitDate,
      exitType,
      institutionId,
      operatorId,
    } = filters

    const whereClause: Prisma.ExitWhereInput = {

      ...(institutionId && {
        stock: {
          institutionId: { equals: institutionId },
        },
      }),
      ...(exitDate && {
        exitDate: {
          lte: exitDate,
          gte: exitDate,
        },
      }),
      ...(exitType && {
        exitType: { equals: exitType },
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
          stock: {
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
      return ExitDetails.create({
        exitDate: exit.exitDate,
        operator: exit.operator.name,
        stock: exit.stock.name,
        exitId: new UniqueEntityId(exit.id),
        items: 0,
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

  // async fetchMovimentation(filters: {
  //   institutionId: string;
  //   startDate: Date;
  //   endDate: Date;
  //   operatorId?: string;
  //   medicineId?: string;
  //   stockId?: string;
  //   medicineVariantId?: string;
  //   medicineStockId?: string;
  //   batcheStockId?: string;
  //   quantity?: number;
  //   movementTypeId?: string;
  //   exitType?: ExitType;
  // }): Promise<{ exitsMovimentation: Movimentation[]; meta: MetaReport }> {
  //   const {
  //     endDate,
  //     institutionId,
  //     startDate,
  //     batcheStockId,
  //     exitType,
  //     medicineId,
  //     medicineStockId,
  //     medicineVariantId,
  //     movementTypeId,
  //     operatorId,
  //     quantity,
  //     stockId,
  //   } = filters

  //   const whereClause: Prisma.ExitWhereInput = {

  //     ...(quantity && { quantity: { gte: Number(quantity), lte: Number(quantity) } }),
  //     batchestock: {
  //       ...(stockId && { stockId: { equals: stockId } }),
  //       ...(batcheStockId && {
  //         id: {
  //           equals: batcheStockId,
  //         },
  //       }),
  //       ...(institutionId && {
  //         stock: {
  //           institutionId: { equals: institutionId },
  //         },
  //       }),
  //     },
  //     ...(startDate && { exitDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) } }),
  //     ...(endDate && { exitDate: { lte: new Date(endDate.setHours(23, 59, 59, 999)) } }),
  //     ...(exitType && {
  //       exitType: {
  //         equals: $Enums.ExitType[exitType],
  //       },
  //     }),
  //     ...(medicineId && {
  //       medicineStock: {
  //         medicineVariant: {
  //           medicineId: { equals: medicineId },
  //         },
  //       },
  //     }),

  //     ...(medicineVariantId && {
  //       medicineStock: {
  //         medicineVariant: {
  //           id: { equals: medicineVariantId },
  //         },
  //       },
  //     }),

  //     ...(medicineStockId && {
  //       medicineStock: {
  //         id: { equals: medicineStockId },
  //       },
  //     }),
  //     ...(movementTypeId && {
  //       movementTypeId: { equals: movementTypeId },
  //     }),
  //     ...(operatorId && {
  //       operatorId: { equals: operatorId },
  //     }),
  //   }

  //   const [medicinesExits, totalCount] = await this.prisma.$transaction([
  //     this.prisma.exit.findMany({
  //       where: whereClause,
  //       include: {
  //         batchestock: {
  //           include: {
  //             batch: {
  //               select: {
  //                 code: true,
  //               },
  //             },
  //             stock: { select: { name: true } },
  //           },
  //         },
  //         medicineStock: {
  //           include: {
  //             medicineVariant: {
  //               select: {
  //                 pharmaceuticalForm: {
  //                   select: { id: true, name: true },
  //                 },
  //                 id: true,
  //                 unitMeasure: { select: { acronym: true, id: true } },
  //                 medicine: { select: { id: true, name: true } },
  //                 dosage: true,
  //               },
  //             },
  //           },
  //         },
  //         movementType: {
  //           select: { name: true },
  //         },
  //         operator: {
  //           select: { name: true },
  //         },
  //       },
  //       orderBy: {
  //         exitDate: 'desc',
  //       },
  //     },
  //     ),
  //     this.prisma.exit.count({
  //       where: whereClause,
  //     }),
  //   ])

  //   const movimentationExitsMapped = medicinesExits.map((exit) => {
  //     return Movimentation.create({
  //       direction: 'EXIT',
  //       medicineStockId: new UniqueEntityId(exit.medicineStockId),
  //       batchStockId: new UniqueEntityId(exit.batchestockId),
  //       batchCode: exit.batchestock.batch.code,
  //       movementDate: exit.exitDate,
  //       exitType: ExitType[exit.exitType],
  //       operator: exit.operator.name,
  //       movementType:
  //         exit.exitType === 'MOVEMENT_TYPE'
  //           ? (exit.movementType?.name ?? '')
  //           : exit.exitType === 'DISPENSATION'
  //             ? ExitType.DISPENSATION
  //             : ExitType.EXPIRATION,
  //       stock: exit.batchestock.stock.name,
  //       medicine: exit.medicineStock.medicineVariant.medicine.name,
  //       dosage: exit.medicineStock.medicineVariant.dosage,
  //       pharmaceuticalForm:
  //         exit.medicineStock.medicineVariant.pharmaceuticalForm.name,
  //       unitMeasure: exit.medicineStock.medicineVariant.unitMeasure.acronym,
  //       quantity: exit.quantity,
  //       medicineId: new UniqueEntityId(exit.medicineStock.medicineVariant.medicine.id),
  //       medicineVariantId: new UniqueEntityId(exit.medicineStock.medicineVariant.id),
  //       operatorId: new UniqueEntityId(exit.operatorId),
  //       pharmaceuticalFormId: new UniqueEntityId(exit.medicineStock.medicineVariant.pharmaceuticalForm.id),
  //       stockId: new UniqueEntityId(),
  //       unitMeasureId: new UniqueEntityId(),
  //       complement: '',
  //       movementTypeId: new UniqueEntityId(),
  //     })
  //   })

  //   return {
  //     exitsMovimentation: movimentationExitsMapped,
  //     meta: {
  //       totalCount,
  //     },
  //   }
  // }
}
