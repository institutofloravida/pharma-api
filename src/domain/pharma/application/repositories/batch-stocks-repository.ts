import { Batchestock } from '../../enterprise/entities/batch-stock'

export interface BatchestocksRepository {
  create(batchestock: Batchestock): Promise<void | null>
  save(batchestock: Batchestock): Promise<void | null>
  replenish(batchestockId: string, quantity: number): Promise<Batchestock | null>
  subtract(batchestockId: string, quantity: number): Promise<Batchestock | null>
  findByBatchIdAndStockId(batchId: string, stockId: string): Promise<Batchestock | null>
  findById(id:string): Promise<Batchestock | null>
}
