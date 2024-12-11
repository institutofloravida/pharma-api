import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineEntry } from '../../enterprise/entities/entry'
import  { MedicineEntryWithMedicineVariantAndBatch } from '../../enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import  { Meta } from '@/core/repositories/meta'

export abstract class MedicinesEntriesRepository {
  abstract create(medicineEntry: MedicineEntry): Promise<void>
  abstract findManyByInstitutionId(
    params: PaginationParams,
    institutionId: string,
    operatorId?: string,
    stockId?: string,
    medicineVariantId?: string,
    medicineId?: string,
  ): Promise<{
    medicinesEntries: MedicineEntryWithMedicineVariantAndBatch[];
    meta: Meta;
  }>
}
