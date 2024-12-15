import type { Meta } from '@/core/repositories/meta'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import { BatchesRepository } from '@/domain/pharma/application/repositories/batches-repository'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'

export class InMemoryBatchesRepository implements BatchesRepository {
  public items: Batch[] = []

  async create(batch: Batch) {
    this.items.push(batch)
  }

  async findById(id: string) {
    const batch = this.items.find((item) => item.id.toString() === id)
    if (!batch) {
      return null
    }

    return batch
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
  ): Promise<{ batches: Batch[]; meta: Meta }> {
    const batches = this.items

    const batchesFiltered = batches.filter((item) =>
      item.code.includes(content ?? ''),
    )

    const batchesPaginated = batchesFiltered
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return {
      batches: batchesPaginated,
      meta: {
        page,
        totalCount: batchesFiltered.length,
      },
    }
  }
}
