import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicinesRepository } from '@/domain/pharma/application/repositories/medicines-repository'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'

export class InMemoryMedicinesRepository implements MedicinesRepository {
  public items: Medicine[] = []

  async create(medicine: Medicine) {
    this.items.push(medicine)
  }

  async addMedicinesVariantsId(
    medicineId: string,
    medicineVariantId: string,
  ): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(medicineId)),
    )

    const medicine = await this.items.find((item) =>
      item.id.equal(new UniqueEntityId(medicineId)),
    )
    if (!medicine) {
      throw new Error(`medicamento com id ${medicineId} não foi encontrado!`)
    }
    medicine.medicinesVariantsIds = [
      ...medicine.medicinesVariantsIds,
      new UniqueEntityId(medicineVariantId),
    ]

    this.items[itemIndex] = medicine
  }

  async findByContent(content: string) {
    const medicine = this.items.find(
      (item) =>
        item.content.toLowerCase().trim() === content.toLowerCase().trim(),
    )
    if (!medicine) {
      return null
    }

    return medicine
  }

  async medicineExists(medicine: Medicine) {
    const medicineExists = this.items.find((item) => {
      return medicine.equals(item)
    })

    if (medicineExists) {
      return medicineExists
    }

    return null
  }

  async findById(id: string) {
    const medicine = this.items.find((item) => item.id.toString() === id)
    if (!medicine) {
      return null
    }

    return medicine
  }

  async findByMedicineVariantId(
    medicineVariantId: string,
  ): Promise<Medicine | null> {
    const medicine = this.items.find((item) => {
      const medicinesVariantsIds = item.medicinesVariantsIds.map((item) =>
        item.toString(),
      )
      return medicinesVariantsIds.includes(medicineVariantId)
    })

    if (!medicine) {
      return null
    }

    return medicine
  }

  async findMany(
    { page }: PaginationParams,
    filters: { content?: string; therapeuticClassesIds?: string[] },
  ): Promise<{ medicines: Medicine[]; meta: Meta }> {
    const medicines = this.items

    const { content, therapeuticClassesIds } = filters
    const medicinesFiltred = medicines
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((medicine) => {
        const medicineTherapeuticClassesIdsCasted = medicine.therapeuticClassesIds.map(item => item.toString())

        if (content && !medicine.content.toLowerCase().includes(content.toLowerCase())) {
          return false
        }

        if (therapeuticClassesIds) {
          const containstherapeuticClasses = therapeuticClassesIds.map(item => {
            if (medicineTherapeuticClassesIdsCasted.includes(item)) {
              return true
            }
            return false
          })

          return containstherapeuticClasses.includes(true)
        }

        return medicine
      })

    const medicinesPaginated = medicinesFiltred.slice(
      (page - 1) * 10,
      page * 10,
    )

    return {
      medicines: medicinesPaginated,
      meta: {
        page,
        totalCount: medicinesFiltred.length,
      },
    }
  }
}
