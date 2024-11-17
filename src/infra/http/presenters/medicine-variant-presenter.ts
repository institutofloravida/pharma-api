import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'

export class MedicineVariantPresenter {
  static toHTTP(medicinevariant: MedicineVariant) {
    return {
      id: medicinevariant.id.toString(),
      description: medicinevariant.medicineId.toString(),
      dosage: medicinevariant.dosage,
      pharmaceuticalFormId: medicinevariant.pharmaceuticalFormId.toString(),
      unitMeasureId: medicinevariant.unitMeasureId.toString(),
    }
  }
}
