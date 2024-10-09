import type { MedicineStock } from '../../enterprise/entities/medicine-stock'

export interface MedicineStockRepository {
  create(medicinestock: MedicineStock): Promise<void>
  medicineStockExists(medicineStock: MedicineStock): Promise<MedicineStock | null>
}
