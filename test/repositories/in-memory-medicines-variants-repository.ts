import { MedicinesVariantsRepository } from '@/domain/pharma/application/repositories/medicine-variant-repository'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'

export class InMemoryMedicinesVariantsRepository implements MedicinesVariantsRepository {
  public items: MedicineVariant[] = []

  async create(medicinevariant: MedicineVariant) {
    this.items.push(medicinevariant)
  }

  async medicineVariantExists(medicinevariant: MedicineVariant) {
    const medicineVariantExists = this.items.find(item => {
      return medicinevariant.equals(item)
    })

    if (medicineVariantExists) {
      return medicineVariantExists
    }

    return null
  }

  async findById(id: string) {
    const medicineVariant = this.items.find(item => item.id.toString() === id)
    if (!medicineVariant) {
      return null
    }

    return medicineVariant
  }
}
