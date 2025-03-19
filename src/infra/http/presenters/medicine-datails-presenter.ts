import { MedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-details'

export class MedicineDetailsPresenter {
  static toHTTP(medicine: MedicineDetails) {
    return {
      id: medicine.id.toString(),
      name: medicine.content,
      description: medicine.description,
      createdAt: medicine.createdAt,
      updateAt: medicine.updatedAt,
      therapeuticsClasses: medicine.therapeuticClasses.map(tc => ({ id: tc.id.toString(), name: tc.name })),
    }
  }
}
