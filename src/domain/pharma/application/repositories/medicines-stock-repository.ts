import type { MedicineStock } from '../../enterprise/entities/medicine-stock'

export interface MedicinesStockRepository {
  create(medicinestock: MedicineStock): Promise<void>
  save(medicinestock: MedicineStock): Promise<void | null>
  replenish(medicineStockId: string, quantity: number): Promise<MedicineStock | null>
  subtract(medicineStockId: string, quantity: number): Promise<MedicineStock | null>
  findById(id: string): Promise<MedicineStock | null>
  findByMedicineIdAndStockId(medicineId: string, stockId: string): Promise<MedicineStock | null>
  medicineStockExists(medicineStock: MedicineStock): Promise<MedicineStock | null>
}
