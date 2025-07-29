import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { PrismaMedicineEntryMapper } from '../mappers/prisma-medicine-entry-mapper'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { EntryDetails } from '@/domain/pharma/enterprise/entities/value-objects/entry-details'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaMedicinesEntriesRepository
implements MedicinesEntriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(medicineEntry: MedicineEntry): Promise<void> {
    await this.prisma.medicineEntry.create({
      data: PrismaMedicineEntryMapper.toPrisma(medicineEntry),
    })
  }

  async findMany(
    { page }: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      stockId?: string;
      entryDate?: Date;
    },
  ): Promise<{ entries: EntryDetails[]; meta: Meta }> {
    const { institutionId, entryDate, operatorId, stockId } = filters

    const whereClauses: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (institutionId) {
      whereClauses.push(`s.institution_id = $${paramIndex++}`)
      params.push(institutionId)
    }
    if (operatorId) {
      whereClauses.push(`me.operator_id = $${paramIndex++}`)
      params.push(operatorId)
    }
    if (stockId) {
      whereClauses.push(`me.stock_id = $${paramIndex++}`)
      params.push(stockId)
    }
    if (entryDate) {
      whereClauses.push(`me.entry_date::date = $${paramIndex++}::date`)
      params.push(entryDate)
    }
    const whereSQL = whereClauses.length > 0
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const entries = await this.prisma.$queryRawUnsafe<any[]>(`
  SELECT
    me.id AS "entryId",
    me.entry_date AS "entryDate",
    me.nf_number AS "nfNumber",
    me.operator_id AS "operatorId",
    me.stock_id AS "stockId",
    COUNT(DISTINCT bs.medicine_stock_id) AS "medicinesCount"
  FROM medicines_entries me
  LEFT JOIN stocks s ON s.id = me.stock_id
  LEFT JOIN movimentation m ON m.entry_id = me.id
  LEFT JOIN batches_stocks bs ON bs.id = m.batch_stock_id
  ${whereSQL}
  GROUP BY me.id, me.entry_date, me.nf_number, me.operator_id, me.stock_id
  ORDER BY me.entry_date DESC
  LIMIT 10 OFFSET ${(page - 1) * 10}
`, ...params)

    // Para totalCount, faz uma query separada
    const totalCountResult = await this.prisma.$queryRawUnsafe<any[]>(`
  SELECT COUNT(*)::int as count
  FROM medicines_entries me
  LEFT JOIN stocks s ON s.id = me.stock_id
  ${whereSQL}
`, ...params)
    const totalCount = totalCountResult[0]?.count || 0

    // Busca os operadores e estoques para mapear nomes
    const operatorIds = entries.map(e => e.operatorId)
    const stockIds = entries.map(e => e.stockId)
    const [operators, stocks] = await Promise.all([
      this.prisma.operator.findMany({ where: { id: { in: operatorIds } } }),
      this.prisma.stock.findMany({ where: { id: { in: stockIds } } }),
    ])

    const medicinesEntriesFilteredMapped = entries.map(
      (item) => {
        const operator = operators.find(o => o.id === item.operatorId)
        const stock = stocks.find(s => s.id === item.stockId)
        return EntryDetails.create({
          entryDate: item.entryDate,
          operator: operator?.name || '',
          stock: stock?.name || '',
          nfNumber: item.nfNumber,
          entryId: new UniqueEntityId(item.entryId),
          items: Number(item.medicinesCount),
        })
      },
    )

    return {
      entries: medicinesEntriesFilteredMapped,
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
  // }): Promise<{ entriesMovimentation: Movimentation[]; meta: MetaReport }> {
  //   const {
  //     institutionId,
  //     startDate,
  //     endDate,
  //     batcheStockId,
  //     medicineId,
  //     medicineStockId,
  //     medicineVariantId,
  //     movementTypeId,
  //     operatorId,
  //     quantity,
  //     stockId,
  //   } = filters

  //   const medicinesEntriesFiltered = await this.prisma.medicineEntry.findMany({
  //     where: {
  //       ...(medicineStockId && {
  //         medicineStockId,
  //       }),
  //       ...(batcheStockId && {
  //         batchStockId: batcheStockId,
  //       }),
  //       ...(movementTypeId && { movementTypeId }),
  //       ...(quantity && {
  //         quantity: {
  //           lte: Number(quantity),
  //           gte: Number(quantity),
  //         },
  //       }),
  //       batcheStock: {
  //         stock: {
  //           ...(stockId && { id: stockId }),
  //           institutionId,
  //         },
  //         medicineVariant: {
  //           ...(medicineId && { medicineId }),
  //           ...(medicineVariantId && { id: medicineVariantId }),
  //         },
  //       },
  //       ...(operatorId && { operatorId }),
  //       ...(startDate && {
  //         entryDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) },
  //       }),
  //       ...(endDate && {
  //         entryDate: { lte: new Date(endDate.setHours(23, 59, 59, 999)) },
  //       }),
  //     },
  //     include: {
  //       batcheStock: {
  //         include: {
  //           batch: true,
  //         },
  //       },
  //       movementType: {
  //         select: {
  //           id: true,
  //           name: true,
  //         },
  //       },
  //       medicineStock: {
  //         include: {
  //           medicineVariant: {
  //             include: {
  //               medicine: true,
  //               unitMeasure: true,
  //               pharmaceuticalForm: true,
  //             },
  //           },
  //           stock: true,
  //         },
  //       },
  //       operator: true,
  //     },
  //     orderBy: {
  //       entryDate: 'desc',
  //     },
  //   })

  //   const entriesMovimentationFilteredMapped = medicinesEntriesFiltered.map(
  //     (item) => {
  //       return Movimentation.create({
  //         batchStockId: new UniqueEntityId(item.batchStockId),
  //         medicine: item.medicineStock.medicineVariant.medicine.name,
  //         movementDate: item.entryDate,
  //         medicineStockId: new UniqueEntityId(item.medicineStockId),
  //         medicineVariantId: new UniqueEntityId(
  //           item.medicineStock.medicineVariant.id,
  //         ),
  //         movementTypeId: new UniqueEntityId(item.movementTypeId),
  //         operator: item.operator.name,
  //         operatorId: new UniqueEntityId(item.operatorId),
  //         pharmaceuticalForm:
  //           item.medicineStock.medicineVariant.pharmaceuticalForm.name,
  //         quantity: item.quantity,
  //         stock: item.medicineStock.stock.name,
  //         unitMeasure: item.medicineStock.medicineVariant.unitMeasure.acronym,
  //         batchCode: item.batcheStock.batch.code,
  //         dosage: item.medicineStock.medicineVariant.dosage,
  //         medicineId: new UniqueEntityId(
  //           item.medicineStock.medicineVariant.medicineId,
  //         ),
  //         movementType: item.movementType.name,
  //         pharmaceuticalFormId: new UniqueEntityId(
  //           item.medicineStock.medicineVariant.pharmaceuticalForm.id,
  //         ),
  //         unitMeasureId: new UniqueEntityId(
  //           item.medicineStock.medicineVariant.unitMeasure.id,
  //         ),
  //         stockId: new UniqueEntityId(item.batcheStock.stockId),
  //         complement: item.medicineStock.medicineVariant.complement,
  //         exitType: undefined,
  //         direction: 'ENTRY',
  //       })
  //     },
  //   )

  //   return {
  //     entriesMovimentation: entriesMovimentationFilteredMapped,
  //     meta: {
  //       totalCount: entriesMovimentationFilteredMapped.length,
  //     },
  //   }
  // }
}
