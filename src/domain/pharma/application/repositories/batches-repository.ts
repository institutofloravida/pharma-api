import { PaginationParams } from '@/core/repositories/pagination-params'
import { Batch } from '../../enterprise/entities/batch'
import { Meta } from '@/core/repositories/meta'

export abstract class BatchesRepository {
  abstract create(batch: Batch): Promise<void>
  abstract findById(id: string): Promise<Batch | null>
  abstract findMany(
    params: PaginationParams,
    content?: string,
  ): Promise<{ batches: Batch[]; meta: Meta }>
}
