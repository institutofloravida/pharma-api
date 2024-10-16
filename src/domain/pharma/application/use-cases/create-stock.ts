import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'

import { Stock } from '../../enterprise/entities/stock'
import type { StocksRepository } from '../repositories/stocks-repository'

interface createStockUseCaseRequest {
  content: string
  status: boolean
}
type createStockUseCaseResponse = Either<
  ConflictError,
  {
    stock: Stock
  }
>
export class CreateStockUseCase {
  constructor(private stockRepository: StocksRepository) {}
  async execute({
    content,
    status,
  }: createStockUseCaseRequest): Promise<createStockUseCaseResponse> {
    const stock = Stock.create({
      content,
      status,
    })

    const stockExists = await this.stockRepository.findByContent(content)
    if (stockExists) {
      return left(new ConflictError())
    }

    await this.stockRepository.create(stock)

    return right({
      stock,
    })
  }
}
