import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'

export class MedicineVariantWithMedicinePresenter {
  static toHTTP(medicineVariantWithMedicine: MedicineVariantWithMedicine) {
    return {
      id: medicineVariantWithMedicine.medicineVariantId.toString(),
      medicineId: medicineVariantWithMedicine.medicineId.toString(),
      medicine: medicineVariantWithMedicine.medicine,
      dosage: medicineVariantWithMedicine.dosage,
      pharmaceuticalFormId: medicineVariantWithMedicine.pharmaceuticalFormId.toString(),
      pharmaceuticalForm: medicineVariantWithMedicine.pharmaceuticalForm,
      unitMeasureId: medicineVariantWithMedicine.unitMeasureId.toString(),
      unitMeasure: medicineVariantWithMedicine.unitMeasure,
      complement: medicineVariantWithMedicine.complement,
      createdAt: medicineVariantWithMedicine.createdAt,
      updatedAt: medicineVariantWithMedicine.updatedAt,
    }
  }
}
