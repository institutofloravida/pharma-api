import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'

export class MedicineEntryWithMedicineVariantAndBatchPresenter {
  static toHTTP(medicineEntry: MedicineEntryWithMedicineVariantAndBatch) {
    return {
      stock: medicineEntry.stock,
      stockId: medicineEntry.stockId,
      medicine: medicineEntry.medicine,
      medicineId: medicineEntry.medicineId,
      medicineVariantId: medicineEntry.medicineVariantId,
      dosage: medicineEntry.dosage,
      operator: medicineEntry.operator,
      operatorId: medicineEntry.operatorId,
      pharmaceuticalForm: medicineEntry.pharmaceuticalForm,
      pharmaceuticalFormId: medicineEntry.pharmaceuticalFormId,
      unitMeasure: medicineEntry.unitMeasure,
      unitMeasureId: medicineEntry.unitMeasureId,
      batch: medicineEntry.batch,
      batchId: medicineEntry.batchId,
      quantityToEntry: medicineEntry.quantityToEntry,
      updatedAt: medicineEntry.updatedAt,

    }
  }
}
