import type { Medicine } from '../../enterprise/entities/medicine'

export interface MedicineRepository {
  create(medicine: Medicine): Promise<void>
  medicineExists(medicine: Medicine): Promise<Medicine | null>
}
