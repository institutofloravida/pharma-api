import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineVariant } from '../../enterprise/entities/medicine-variant'
import { MedicineVariantWithMedicine } from '../../enterprise/entities/value-objects/medicine-variant-with-medicine'

export abstract class MedicinesVariantsRepository {
  abstract create(medicinevariant: MedicineVariant): Promise<void>
  abstract medicineVariantExists(medicinevariant: MedicineVariant): Promise<MedicineVariant | null>
  abstract findById(id:string): Promise<MedicineVariant | null>
  abstract findManyByMedicineIdWithMedicine(medicineId: string, params: PaginationParams): Promise<MedicineVariantWithMedicine[]>
}
