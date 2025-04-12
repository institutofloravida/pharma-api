import { PaginationParams } from '@/core/repositories/pagination-params'
import { Medicine } from '../../enterprise/entities/medicine'
import { Meta } from '@/core/repositories/meta'
import { MedicineDetails } from '../../enterprise/entities/value-objects/medicine-details'

export abstract class MedicinesRepository {
  abstract create(medicine: Medicine): Promise<void>
  abstract save(medicine: Medicine): Promise<void>
  abstract addMedicinesVariantsId(medicineId: string, medicineVariantId: string): Promise<void>
  abstract medicineExists(medicine: Medicine): Promise<Medicine | null>
  abstract findById(id: string): Promise<Medicine | null>
  abstract findByIdWithDetails(id: string): Promise<MedicineDetails | null>
  abstract findByName(name: string): Promise<Medicine | null>
  abstract findByMedicineVariantId(medicineVariantid: string): Promise<Medicine | null>
  abstract findMany(
    params: PaginationParams,
    filters: {
      content?: string,
      therapeuticClassesIds?: string[]
    }

  ): Promise<{ medicines: Medicine[]; meta: Meta }>
}
