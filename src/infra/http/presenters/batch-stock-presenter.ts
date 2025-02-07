import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

export class BatchStockPresenter {
  static toHTTP(batchstock: BatchStock) {
    return {
      id: batchstock.id.toString(),
      batchId: batchstock.batchId.toString(),
      medicineStockId: batchstock.medicineStockId.toString(),
      medicineVariantId: batchstock.medicineVariantId.toString(),
      quantity: batchstock.quantity,
      createdAt: batchstock.createdAt,
      updatedAt: batchstock.updatedAt,
    }
  }
}
