import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { BatchAlreadyExistsError } from './_errors/batch-already-exists-error'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'

interface UpdateBatchUseCaseRequest {
  batchId: string
  code?: string
  expirationDate?: Date
  manufacturingDate?: Date | null
}

type UpdateBatchUseCaseResponse = Either<
  ResourceNotFoundError | BatchAlreadyExistsError,
  { batch: Batch }
>

@Injectable()
export class UpdateBatchUseCase {
  constructor(private batchesRepository: BatchesRepository) {}

  async execute({
    batchId,
    code,
    expirationDate,
    manufacturingDate,
  }: UpdateBatchUseCaseRequest): Promise<UpdateBatchUseCaseResponse> {
    const batch = await this.batchesRepository.findById(batchId)
    if (!batch) {
      return left(new ResourceNotFoundError())
    }

    if (code && code !== batch.code) {
      const existing = await this.batchesRepository.exists(
        code,
        batch.manufacturerId.toString(),
      )
      if (existing && !batch.id.equal(existing.id)) {
        return left(new BatchAlreadyExistsError(code))
      }
      batch.code = code
    }

    if (expirationDate) {
      batch.expirationDate = expirationDate
    }

    if (manufacturingDate !== undefined) {
      batch.manufacturingDate = manufacturingDate
    }

    await this.batchesRepository.save(batch)

    return right({ batch })
  }
}
