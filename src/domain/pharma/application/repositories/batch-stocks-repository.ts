import type { BatchStock } from '../../enterprise/entities/batch-stock'

export interface BatchStocksRepository {
  create(batchstock: BatchStock): Promise<void>
  findById(id:string): Promise<BatchStock | null>
}
