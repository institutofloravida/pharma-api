import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StockSettingsRepository } from '../../../repositories/stock-settings-repository'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { StockNotFoundError } from './_errors/stock-not-found-error'

interface GetStockSettingsUseCaseRequest {
  stockId: string
}

type GetStockSettingsUseCaseResponse = Either<
  StockNotFoundError,
  {
    settings: {
      expirationWarningDays: number
    }
  }
>

@Injectable()
export class GetStockSettingsUseCase {
  constructor(
    private stockSettingsRepository: StockSettingsRepository,
    private stocksRepository: StocksRepository,
  ) {}

  async execute({
    stockId,
  }: GetStockSettingsUseCaseRequest): Promise<GetStockSettingsUseCaseResponse> {
    const stock = await this.stocksRepository.findById(stockId)
    if (!stock) {
      return left(new StockNotFoundError(stockId))
    }

    const settings = await this.stockSettingsRepository.findByStockId(stockId)

    return right({
      settings: {
        expirationWarningDays: settings?.expirationWarningDays ?? 30,
      },
    })
  }
}
