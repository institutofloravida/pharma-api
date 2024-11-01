import { Batchestock } from '../../enterprise/entities/batch-stock'

export abstract class BatchestocksRepository {
  abstract create(batchestock: Batchestock): Promise<void | null>
  abstract save(batchestock: Batchestock): Promise<void | null>
  abstract replenish(batchestockId: string, quantity: number): Promise<Batchestock | null>
  abstract subtract(batchestockId: string, quantity: number): Promise<Batchestock | null>
  abstract findByBatchIdAndStockId(batchId: string, stockId: string): Promise<Batchestock | null>
  abstract findById(id:string): Promise<Batchestock | null>
}
