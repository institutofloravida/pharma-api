import type { BatchStockRepository } from '@/domain/pharma/application/repositories/batch-stock-repository'
import type { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

export class InMemoryBatchStockRepository implements BatchStockRepository {
  public items: BatchStock[] = []

  async create(batchstock: BatchStock) {
    this.items.push(batchstock)
  }

  async findById(id: string) {
    const batchstock = this.items.find(item => item.id.toString() === id)
    if (!batchstock) {
      return null
    }

    return batchstock
  }
}
