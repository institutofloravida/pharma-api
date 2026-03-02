import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StockSettingsRepository } from '../../../repositories/stock-settings-repository'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { StockSettings } from '../../../../enterprise/entities/stock-settings'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { StockNotFoundError } from './_errors/stock-not-found-error'

interface UpsertStockSettingsUseCaseRequest {
  stockId: string
  expirationWarningDays: number
}

type UpsertStockSettingsUseCaseResponse = Either<
  StockNotFoundError,
  {
    settings: StockSettings
  }
>

@Injectable()
export class UpsertStockSettingsUseCase {
  constructor(
    private stockSettingsRepository: StockSettingsRepository,
    private stocksRepository: StocksRepository,
  ) {}

  async execute({
    stockId,
    expirationWarningDays,
  }: UpsertStockSettingsUseCaseRequest): Promise<UpsertStockSettingsUseCaseResponse> {
    const stock = await this.stocksRepository.findById(stockId)
    if (!stock) {
      return left(new StockNotFoundError(stockId))
    }

    let settings = await this.stockSettingsRepository.findByStockId(stockId)

    if (settings) {
      settings.expirationWarningDays = expirationWarningDays
    } else {
      settings = StockSettings.create({
        stockId: new UniqueEntityId(stockId),
        expirationWarningDays,
      })
    }

    await this.stockSettingsRepository.upsert(settings)

    return right({ settings })
  }
}
