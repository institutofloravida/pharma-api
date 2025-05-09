import { PaginationParams } from '@/core/repositories/pagination-params'
import { BatchStock } from '../../enterprise/entities/batch-stock'
import { Meta } from '@/core/repositories/meta'
import { BatchStockWithBatch } from '../../enterprise/entities/value-objects/batch-stock-with-batch'

export abstract class BatchStocksRepository {
  abstract create(batchStock: BatchStock): Promise<void | null>
  abstract save(batchStock: BatchStock): Promise<void | null>
  abstract replenish(batchStockId: string, quantity: number): Promise<BatchStock | null>
  abstract subtract(batchStockId: string, quantity: number): Promise<BatchStock | null>
  abstract findByBatchIdAndStockId(batchId: string, stockId: string): Promise<BatchStock | null>
  abstract findById(id:string): Promise<BatchStock | null>
  abstract findMany(params: PaginationParams, filters: {
    medicineStockId: string
    code?: string
    includeExpired?: boolean
  }, pagination?: boolean): Promise<{ batchesStock: BatchStockWithBatch[], meta: Meta }>
}
