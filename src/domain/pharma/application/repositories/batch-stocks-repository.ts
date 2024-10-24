import { BatchStock } from '../../enterprise/entities/batch-stock'

export interface BatchStocksRepository {
  create(batchStock: BatchStock): Promise<void | null>
  save(batchstock: BatchStock): Promise<void | null>
  replenish(batchStockId: string, quantity: number): Promise<BatchStock | null>
  subtract(batchStockId: string, quantity: number): Promise<BatchStock | null>
  findByBatchIdAndStockId(batchId: string, stockId: string): Promise<BatchStock | null>
  findById(id:string): Promise<BatchStock | null>
}
