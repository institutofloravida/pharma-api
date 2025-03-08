import { left, right, type Either } from '@/core/either'
import { Stock } from '../../../../enterprise/entities/stock'
import { Injectable } from '@nestjs/common'
import { StockAlreadyExistsError } from './_errors/stock-already-exists-error'
import { StockNotFoundError } from './_errors/stock-not-found-error'
import { StocksRepository } from '../../../repositories/stocks-repository'

interface updateStockUseCaseRequest {
  stockId: string;
  content?: string;
  status?: boolean
}

type updateStockUseCaseResponse = Either<
  StockAlreadyExistsError | StockNotFoundError,
  {
    stock: Stock;
  }
>

@Injectable()
export class UpdateStockUseCase {
  constructor(private stocksRepository: StocksRepository) {}
  async execute({
    content,
    stockId,
  }: updateStockUseCaseRequest): Promise<updateStockUseCaseResponse> {
    const stock = await this.stocksRepository.findById(stockId)
    if (!stock) {
      return left(new StockNotFoundError(stockId))
    }

    if (content) {
      const stockWithSameContent =
        await this.stocksRepository.findByContent(content, stock.institutionId.toString())
      if (
        stockWithSameContent &&
        !stock.id.equal(stockWithSameContent.id)
      ) {
        return left(new StockAlreadyExistsError(content))
      }
      stock.content = content
    }

    await this.stocksRepository.save(stock)

    return right({
      stock,
    })
  }
}
