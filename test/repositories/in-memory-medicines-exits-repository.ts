import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository'
import { MedicineExit } from '@/domain/pharma/enterprise/entities/exit'

export class InMemoryMedicinesExitsRepository implements MedicinesExitsRepository {
  public items: MedicineExit[] = []
  async create(medicineExit: MedicineExit) {
    this.items.push(medicineExit)
  }
}
