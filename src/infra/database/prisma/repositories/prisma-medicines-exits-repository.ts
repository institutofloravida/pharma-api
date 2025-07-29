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
    const { exitDate, exitType, institutionId, operatorId } = filters

    const whereClauses: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (institutionId) {
      whereClauses.push(`s.institution_id = $${paramIndex++}`)
      params.push(institutionId)
    }
    if (operatorId) {
      whereClauses.push(`e.operator_id = $${paramIndex++}`)
      params.push(operatorId)
    }
    if (exitType) {
      whereClauses.push(`e.exit_type = $${paramIndex++}`)
      params.push(exitType)
    }
    if (exitDate) {
      whereClauses.push(`e.exit_date::date = $${paramIndex++}::date`)
      params.push(exitDate)
    }

    const whereSQL = whereClauses.length > 0
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const exits = await this.prisma.$queryRawUnsafe<any[]>(`
    select 
      e.id as "id",
      e.exit_date as "exitDate",
      o."name" as "operatorName",
      s."name" as "stockName",
      COUNT(distinct bs.medicine_stock_id) as "items"
    from movimentation m
    inner join "exits" e on e.id = m.exit_id
    inner join batches_stocks bs on bs.id = m.batch_stock_id
    inner join operators o on o.id = e.operator_id
    inner join stocks s on s.id = e.stock_id
    ${whereSQL}
    group by e.id, o."name", s."name"
    order by e.exit_date desc
    limit 10 offset ${(page - 1) * 10}
  `, ...params)

    // Para totalCount, faz uma query separada
    const totalCountResult = await this.prisma.$queryRawUnsafe<any[]>(`
    select count(*)::int as count
    from (
      select e.id
      from movimentation m
      inner join "exits" e on e.id = m.exit_id
      inner join batches_stocks bs on bs.id = m.batch_stock_id
      inner join operators o on o.id = e.operator_id
      inner join stocks s on s.id = e.stock_id
      ${whereSQL}
      group by e.id, o."name", s."name"
    ) as sub
  `, ...params)
    const totalCount = totalCountResult[0]?.count || 0

    const medicinesExitsMapped = exits.map((exit) => {
      return ExitDetails.create({
        exitDate: exit.exitDate,
        operator: exit.operatorName,
        stock: exit.stockName,
        exitId: new UniqueEntityId(exit.id),
        items: Number(exit.items),
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
