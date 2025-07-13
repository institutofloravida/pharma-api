import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { BatchStocksRepository } from '../../../repositories/batch-stocks-repository'
import { BatchStockWithBatch } from '@/domain/pharma/enterprise/entities/value-objects/batch-stock-with-batch'

interface FetchBatchesStockUseCaseRequest {
  page: number;
  medicineStockId: string
  code?: string;
  includeZero?: boolean
  includeExpired?: boolean
}

type FetchBatchesStockUseCaseResponse = Either<
  null,
  {
    batchesStock: BatchStockWithBatch[];
    meta: Meta;
  }
>

@Injectable()
export class FetchBatchesStockUseCase {
  constructor(private batchesStockRepository: BatchStocksRepository) {}

  async execute({
    page,
    code,
    medicineStockId,
    includeZero,
    includeExpired = true,
  }: FetchBatchesStockUseCaseRequest): Promise<FetchBatchesStockUseCaseResponse> {
    const { batchesStock, meta } = await this.batchesStockRepository.findMany(
      { page },
      {
        medicineStockId,
        code,
        includeExpired,
        includeZero,
      },
    )

    return right({
      batchesStock,
      meta,
    })
  }
}
