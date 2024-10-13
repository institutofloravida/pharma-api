import type { MedicineStock } from '../../enterprise/entities/medicine-stock'

export interface MedicinesStockRepository {
  create(medicinestock: MedicineStock): Promise<void>
  medicineStockExists(medicineStock: MedicineStock): Promise<MedicineStock | null>
}
