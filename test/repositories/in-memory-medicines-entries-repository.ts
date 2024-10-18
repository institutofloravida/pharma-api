import type { MedicinesEntriesRepository } from '@/domain/pharma/application/repositories/medicines-entries-repository'
import type { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'

export class InMemoryMedicinesEntrysRepository implements MedicinesEntriesRepository {
  public items: MedicineEntry[] = []

  async create(medicineEntry: MedicineEntry) {
    this.items.push(medicineEntry)
  }
}