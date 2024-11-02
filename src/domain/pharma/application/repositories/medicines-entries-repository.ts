import { MedicineEntry } from '../../enterprise/entities/entry'

export abstract class MedicinesEntriesRepository {
  abstract create(medicineEntry: MedicineEntry): Promise<void>
}
