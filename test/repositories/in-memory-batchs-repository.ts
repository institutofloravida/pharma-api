import { BatchsRepository } from '@/domain/pharma/application/repositories/batchs-repository'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'

export class InMemoryBatchsRepository implements BatchsRepository {
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
