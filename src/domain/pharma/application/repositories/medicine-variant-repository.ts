import { MedicineVariant } from '../../enterprise/entities/medicine-variant'

export abstract class MedicinesVariantsRepository {
  abstract create(medicinevariant: MedicineVariant): Promise<void>
  abstract medicineVariantExists(medicinevariant: MedicineVariant): Promise<MedicineVariant | null>
  abstract findById(id:string): Promise<MedicineVariant | null>
}
