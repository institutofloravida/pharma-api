import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { Meta } from '@/core/repositories/meta'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'

interface FetchBatchesUseCaseRequest {
  page: number
  content?: string
}

type FetchBatchesUseCaseResponse = Either<
  null,
  {
    batches: Batch[],
    meta: Meta
  }
>

@Injectable()
export class FetchBatchesUseCase {
  constructor(private batchesRepository: BatchesRepository) {}

  async execute({
    page,
    content,
  }: FetchBatchesUseCaseRequest): Promise<FetchBatchesUseCaseResponse> {
    const { batches, meta } = await this.batchesRepository.findMany({ page }, content)

    return right({
      batches,
      meta,
    })
  }
}
