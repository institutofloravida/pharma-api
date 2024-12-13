import { BatchStock } from '../../enterprise/entities/batch-stock'

export abstract class BatchStocksRepository {
  abstract create(batchStock: BatchStock): Promise<void | null>
  abstract save(batchStock: BatchStock): Promise<void | null>
  abstract replenish(batchStockId: string, quantity: number): Promise<BatchStock | null>
  abstract subtract(batchStockId: string, quantity: number): Promise<BatchStock | null>
  abstract findByBatchIdAndStockId(batchId: string, stockId: string): Promise<BatchStock | null>
  abstract findById(id:string): Promise<BatchStock | null>
}
