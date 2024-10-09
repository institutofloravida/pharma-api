import type { MedicineRepository } from '@/domain/pharma/application/repositories/medicine-repository'
import type { Medicine } from '@/domain/pharma/enterprise/entities/medicine'

export class InMemoryMedicineRepository implements MedicineRepository {
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
    const medicineExists = await this.items.find(item => {
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
}
