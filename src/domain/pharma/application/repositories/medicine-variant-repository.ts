import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineVariant } from '../../enterprise/entities/medicine-variant'
import { MedicineVariantWithMedicine } from '../../enterprise/entities/value-objects/medicine-variant-with-medicine'
import { Meta } from '@/core/repositories/meta'

export abstract class MedicinesVariantsRepository {
  abstract create(medicineVariant: MedicineVariant): Promise<void>
  abstract save(medicineVariant: MedicineVariant): Promise<void>
  abstract medicineVariantExists(medicineVariant: MedicineVariant): Promise<MedicineVariant | null>
  abstract findById(id:string): Promise<MedicineVariant | null>
  abstract findByIdWithDetails(id:string): Promise<MedicineVariantWithMedicine | null>
  abstract findMany(
    params: PaginationParams,
    filters: {
      medicineId?: string,
      pharmaceuticalFormId: string,
      unitMeasureId?: string
      content?: string
    }
  ): Promise<{
    medicinesVariants: MedicineVariantWithMedicine[],
    meta: Meta
  }>
  abstract delete(medicineVariantId: string): Promise<void>
}
