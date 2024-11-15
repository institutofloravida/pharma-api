import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'

export class MedicineVariantPresenter {
  static toHTTP(medicinevariant: MedicineVariant) {
    return {
      id: medicinevariant.id.toString(),
      description: medicinevariant.medicineId,
      dosage: medicinevariant.dosage,
      pharmaceuticalFormId: medicinevariant.pharmaceuticalFormId,
      unitMeasureId: medicinevariant.unitMeasureId,
    }
  }
}
