import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineVariant } from '../../enterprise/entities/medicine-variant'
import { MedicineVariantWithMedicine } from '../../enterprise/entities/value-objects/medicine-variant-with-medicine'
import { Meta } from '@/core/repositories/meta'

export abstract class MedicinesVariantsRepository {
  abstract create(medicinevariant: MedicineVariant): Promise<void>
  abstract medicineVariantExists(medicinevariant: MedicineVariant): Promise<MedicineVariant | null>
  abstract findById(id:string): Promise<MedicineVariant | null>
  abstract findByIdWithDetails(id:string): Promise<MedicineVariantWithMedicine | null>
  abstract findManyByMedicineIdWithMedicine(
    medicineId: string,
    params: PaginationParams,
    content?: string
  ): Promise<{
    medicinesVariants: MedicineVariantWithMedicine[],
    meta: Meta
  }>
}
