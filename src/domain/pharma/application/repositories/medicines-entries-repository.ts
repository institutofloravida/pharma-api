import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineEntry } from '../../enterprise/entities/entry'
import { MedicineEntryWithMedicineVariantAndBatch } from '../../enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { Movimentation } from '../../enterprise/entities/value-objects/movimentation'
import type { MovementDirection } from '../../enterprise/entities/movement-type'

export abstract class MedicinesEntriesRepository {
  abstract create(medicineEntry: MedicineEntry): Promise<void>
  abstract findManyByInstitutionId(
    params: PaginationParams,
    institutionId: string,
    operatorId?: string,
    stockId?: string,
    medicineId?: string,
    medicineVariantId?: string,
  ): Promise<{
    medicinesEntries: MedicineEntryWithMedicineVariantAndBatch[];
    meta: Meta;
  }>

  abstract fetchMovimentation(
    filters: {
      institutionId: string,
      startDate: Date,
      endDate: Date,
      operatorId?: string,
      medicineId?: string,
      stockId?: string,
      medicineVariantId?: string,
      medicineStockId?: string,
      batcheStockId?: string,
      quantity?: number,
      movementTypeId?: string,
      direction?: MovementDirection
    }
  ): Promise<{
    entriesMovimentation: Movimentation[],
    meta: MetaReport;
  }>
}
