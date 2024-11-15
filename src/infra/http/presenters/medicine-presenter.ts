import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'

export class MedicinePresenter {
  static toHTTP(medicine: Medicine) {
    return {
      id: medicine.id.toString(),
      name: medicine.content,
      description: medicine.description,
      medicinesVariantesIds: medicine.medicinesVariantsIds,
      therapeuticsClassesIds: medicine.therapeuticClassesIds,
    }
  }
}
