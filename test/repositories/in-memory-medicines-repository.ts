import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicinesRepository } from '@/domain/pharma/application/repositories/medicines-repository'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'

export class InMemoryMedicinesRepository implements MedicinesRepository {
  public items: Medicine[] = []

  async create(medicine: Medicine) {
    this.items.push(medicine)
  }

  async findByContent(content: string) {
    const medicine = this.items.find(
      item => item.content.toLowerCase().trim() === content.toLowerCase().trim())
    if (!medicine) {
      return null
    }

    return medicine
  }

  async medicineExists(medicine: Medicine) {
    const medicineExists = this.items.find(item => {
      return medicine.equals(item)
    })

    if (medicineExists) {
      return medicineExists
    }

    return null
  }

  async findById(id: string) {
    const medicine = this.items.find(item => item.id.toString() === id)
    if (!medicine) {
      return null
    }

    return medicine
  }

  async findMany({ page }: PaginationParams, content?: string): Promise<{ medicines: Medicine[], meta: Meta }> {
    const medicines = this.items

    const medicinesFiltred = medicines
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter(item => item.content.includes(content ?? ''))

    const medicinesPaginated = medicinesFiltred
      .slice((page - 1) * 20, page * 20)

    return {
      medicines: medicinesPaginated,
      meta: {
        page,
        totalCount: medicinesFiltred.length,
      },
    }
  }
}
