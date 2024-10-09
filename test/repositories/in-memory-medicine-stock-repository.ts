import { MedicineStockRepository } from '@/domain/pharma/application/repositories/medicine-stock-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'

export class InMemoryMedicineStockRepository implements MedicineStockRepository {
  public items: MedicineStock[] = []

  async create(medicinestock: MedicineStock) {
    this.items.push(medicinestock)
  }

  async medicineStockExists(medicineStock: MedicineStock) {
    const medicineStockExists = await this.items.find(item => {
      return medicineStock.equals(item)
    })

    if (medicineStockExists) {
      return medicineStockExists
    }

    return null
  }

  async findById(id: string) {
    const medicinestock = this.items.find(item => item.id.toString() === id)
    if (!medicinestock) {
      return null
    }

    return medicinestock
  }
}
