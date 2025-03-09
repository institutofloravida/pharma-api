import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StockNotFoundError } from './_errors/stock-not-found-error'
import { StockWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/stock-with-institution'
import { StocksRepository } from '../../../repositories/stocks-repository'

interface GetStockDetailsUseCaseRequest {
  id: string;
}

type GetStockDetailsUseCaseResponse = Either<
  StockNotFoundError,
  StockWithInstitution
>

@Injectable()
export class GetStockDetailsUseCase {
  constructor(private stocksRepository: StocksRepository) {}

  async execute({
    id,
  }: GetStockDetailsUseCaseRequest): Promise<GetStockDetailsUseCaseResponse> {
    const stock = await this.stocksRepository.findByIdWithDetails(id)

    if (!stock) {
      return left(new StockNotFoundError(id))
    }

    return right(stock)
  }
}
