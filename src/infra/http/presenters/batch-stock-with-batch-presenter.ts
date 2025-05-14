import { BatchStockWithBatch } from '@/domain/pharma/enterprise/entities/value-objects/batch-stock-with-batch'

export class BatchStockWithBatchPresenter {
  static toHTTP(batchStockWithBatch: BatchStockWithBatch) {
    return {
      id: batchStockWithBatch.id.toString(),
      stockId: batchStockWithBatch.stockId.toString(),
      stock: batchStockWithBatch.stock,
      batchId: batchStockWithBatch.batchId.toString(),
      batch: batchStockWithBatch.batch,
      medicineStockId: batchStockWithBatch.medicineStockId.toString(),
      medicineVariantId: batchStockWithBatch.medicineVariantId.toString(),
      medicine: batchStockWithBatch.medicine,
      pharmaceuticalForm: batchStockWithBatch.pharmaceuticalForm,
      unitMeasure: batchStockWithBatch.unitMeasure,
      dosage: batchStockWithBatch.dosage,
      quantity: batchStockWithBatch.quantity,
      expirationDate: batchStockWithBatch.expirationDate,
      isAvailable: batchStockWithBatch.isAvailable,
      isCloseToExpiration: batchStockWithBatch.isCloseToExpiration,
      isExpired: batchStockWithBatch.isExpired,
    }
  }
}
