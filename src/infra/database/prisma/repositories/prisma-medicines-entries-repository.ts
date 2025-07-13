import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { PrismaMedicineEntryMapper } from '../mappers/prisma-medicine-entry-mapper'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import { PrismaMedicineEntryWithMedicineVariantAndBatchMapper } from '../mappers/prisma-medicine-entry-with-medicine-variant-and-bath'
import { Movimentation } from '@/domain/pharma/enterprise/entities/value-objects/movimentation'
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

  async findManyByInstitutionId(
    { page }: PaginationParams,
    institutionId: string,
    operatorId?: string,
    stockId?: string,
    medicineId?: string,
    medicineVariantId?: string,
  ): Promise<{
    medicinesEntries: MedicineEntryWithMedicineVariantAndBatch[];
    meta: Meta;
  }> {
    const medicinesEntriesFiltered = await this.prisma.medicineEntry.findMany({
      where: {
        batcheStock: {
          stock: {
            ...(stockId && { id: stockId }),
            institutionId,
          },
          medicineVariant: {
            ...(medicineId && { medicineId }),
            ...(medicineVariantId && { id: medicineVariantId }),
          },
        },
        ...(operatorId && { operatorId }),
      },
      include: {
        batcheStock: {
          include: {
            batch: true,
          },
        },
        medicineStock: {
          include: {
            medicineVariant: {
              include: {
                medicine: true,
                unitMeasure: true,
                pharmaceuticalForm: true,
              },
            },
            stock: true,
          },
        },
        operator: true,
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        entryDate: 'desc',
      },
    })

    const medicinesEntriesFilteredCount = await this.prisma.medicineEntry.count(
      {
        where: {
          batcheStock: {
            stock: {
              institutionId,
            },
          },
        },
      },
    )

    const medicinesEntriesFilteredMapped = medicinesEntriesFiltered.map(
      (item) => {
        return PrismaMedicineEntryWithMedicineVariantAndBatchMapper.toDomain({
          batch: item.batcheStock.batch,
          batchStockId: item.batchStockId,
          medicine: item.medicineStock.medicineVariant.medicine,
          createdAt: item.createdAt,
          entryDate: item.entryDate,
          id: item.id,
          medicineStockId: item.medicineStockId,
          medicineVariant: item.medicineStock.medicineVariant,
          movementTypeId: item.movementTypeId,
          operator: item.operator,
          operatorId: item.operatorId,
          pharmaceuticalForm:
            item.medicineStock.medicineVariant.pharmaceuticalForm,
          quantity: item.quantity,
          stock: item.medicineStock.stock,
          nfNumber: item.nfNumber,
          unitMeasure: item.medicineStock.medicineVariant.unitMeasure,
          updatedAt: item.createdAt,
        })
      },
    )

    return {
      medicinesEntries: medicinesEntriesFilteredMapped,
      meta: {
        page,
        totalCount: medicinesEntriesFilteredCount,
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
  }): Promise<{ entriesMovimentation: Movimentation[]; meta: MetaReport }> {
    const {
      institutionId,
      startDate,
      endDate,
      batcheStockId,
      medicineId,
      medicineStockId,
      medicineVariantId,
      movementTypeId,
      operatorId,
      quantity,
      stockId,
    } = filters

    const medicinesEntriesFiltered = await this.prisma.medicineEntry.findMany({
      where: {
        ...(medicineStockId && {
          medicineStockId,
        }),
        ...(batcheStockId && {
          batchStockId: batcheStockId,
        }),
        ...(movementTypeId && { movementTypeId }),
        ...(quantity && {
          quantity: {
            lte: Number(quantity),
            gte: Number(quantity),
          },
        }),
        batcheStock: {
          stock: {
            ...(stockId && { id: stockId }),
            institutionId,
          },
          medicineVariant: {
            ...(medicineId && { medicineId }),
            ...(medicineVariantId && { id: medicineVariantId }),
          },
        },
        ...(operatorId && { operatorId }),
        ...(startDate && { entryDate: { gte: new Date(startDate.setHours(0, 0, 0, 0)) } }),
        ...(endDate && { entryDate: { lte: new Date(endDate.setHours(23, 59, 59, 999)) } }),
      },
      include: {
        batcheStock: {
          include: {
            batch: true,
          },
        },
        movementType: {
          select: {
            id: true,
            name: true,
          },
        },
        medicineStock: {
          include: {
            medicineVariant: {
              include: {
                medicine: true,
                unitMeasure: true,
                pharmaceuticalForm: true,
              },
            },
            stock: true,
          },
        },
        operator: true,
      },
      orderBy: {
        entryDate: 'desc',
      },
    })

    const entriesMovimentationFilteredMapped = medicinesEntriesFiltered.map(
      (item) => {
        return Movimentation.create({
          batchStockId: new UniqueEntityId(item.batchStockId),
          medicine: item.medicineStock.medicineVariant.medicine.name,
          movementDate: item.entryDate,
          medicineStockId: new UniqueEntityId(item.medicineStockId),
          medicineVariantId: new UniqueEntityId(item.medicineStock.medicineVariant.id),
          movementTypeId: new UniqueEntityId(item.movementTypeId),
          operator: item.operator.name,
          operatorId: new UniqueEntityId(item.operatorId),
          pharmaceuticalForm: item.medicineStock.medicineVariant.pharmaceuticalForm.name,
          quantity: item.quantity,
          stock: item.medicineStock.stock.name,
          unitMeasure: item.medicineStock.medicineVariant.unitMeasure.acronym,
          batchCode: item.batcheStock.batch.code,
          dosage: item.medicineStock.medicineVariant.dosage,
          medicineId: new UniqueEntityId(item.medicineStock.medicineVariant.medicineId),
          movementType: item.movementType.name,
          pharmaceuticalFormId: new UniqueEntityId(item.medicineStock.medicineVariant.pharmaceuticalForm.id),
          unitMeasureId: new UniqueEntityId(item.medicineStock.medicineVariant.unitMeasure.id),
          stockId: new UniqueEntityId(item.batcheStock.stockId),
          complement: item.medicineStock.medicineVariant.complement,
          exitType: undefined,
          direction: 'ENTRY',
        })
      },
    )

    return {
      entriesMovimentation: entriesMovimentationFilteredMapped,
      meta: {
        totalCount: entriesMovimentationFilteredMapped.length,
      },
    }
  }
}
