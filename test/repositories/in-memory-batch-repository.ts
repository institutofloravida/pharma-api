import type { BatchRepository } from '@/domain/pharma/application/repositories/batch-repository'
import type { Batch } from '@/domain/pharma/enterprise/entities/batch'

export class InMemoryBatchRepository implements BatchRepository {
  public items: Batch[] = []

  async create(batch: Batch) {
    this.items.push(batch)
  }

  async findById(id: string) {
    const batch = this.items.find(item => item.id.toString() === id)
    if (!batch) {
      return null
    }

    return batch
  }
}
