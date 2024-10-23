import { MedicineEntry } from '../../enterprise/entities/entry'

export interface MedicinesEntriesRepository {
  create(medicineEntry: MedicineEntry): Promise<void>
}
