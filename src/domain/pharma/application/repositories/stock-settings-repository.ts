import { StockSettings } from '../../enterprise/entities/stock-settings'

export abstract class StockSettingsRepository {
  abstract findByStockId(stockId: string): Promise<StockSettings | null>
  abstract upsert(settings: StockSettings): Promise<void>
}
