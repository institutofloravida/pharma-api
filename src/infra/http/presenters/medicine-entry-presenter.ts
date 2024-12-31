import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'

export class MedicineEntryWithMedicineVariantAndBatchPresenter {
  static toHTTP(medicineEntry: MedicineEntryWithMedicineVariantAndBatch) {
    return {
      medicineEntryId: medicineEntry.medicineEntryId.toString(),
      stock: medicineEntry.stock,
      stockId: medicineEntry.stockId.toString(),
      medicine: medicineEntry.medicine,
      medicineId: medicineEntry.medicineId.toString(),
      medicineVariantId: medicineEntry.medicineVariantId.toString(),
      dosage: medicineEntry.dosage,
      operator: medicineEntry.operator,
      operatorId: medicineEntry.operatorId.toString(),
      pharmaceuticalForm: medicineEntry.pharmaceuticalForm,
      pharmaceuticalFormId: medicineEntry.pharmaceuticalFormId.toString(),
      unitMeasure: medicineEntry.unitMeasure,
      unitMeasureId: medicineEntry.unitMeasureId.toString(),
      batch: medicineEntry.batch,
      batchId: medicineEntry.batchId.toString(),
      quantityToEntry: medicineEntry.quantityToEntry,
      createdAt: medicineEntry.createdAt,
      updatedAt: medicineEntry.updatedAt,

    }
  }
}
