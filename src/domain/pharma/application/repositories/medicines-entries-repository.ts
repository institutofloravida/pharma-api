import { Meta } from '@/core/repositories/meta'
import { MedicineEntry } from '../../enterprise/entities/entry'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { EntryDetails } from '../../enterprise/entities/value-objects/entry-details'

export abstract class MedicinesEntriesRepository {
  abstract create(medicineEntry: MedicineEntry): Promise<void>
  abstract findMany(params: PaginationParams, filters: {
    institutionId: string,
    operatorId?: string,
    stockId?: string,
    entryDate?: Date,
  }): Promise<{ entries: EntryDetails[], meta: Meta }>
}
