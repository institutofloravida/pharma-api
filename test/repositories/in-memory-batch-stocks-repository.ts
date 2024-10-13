import type { BatchStocksRepository } from '@/domain/pharma/application/repositories/batch-stocks-repository'
import type { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

export class InMemoryBatchStocksRepository implements BatchStocksRepository {
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
