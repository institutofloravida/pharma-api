import type { Stock } from '../../enterprise/entities/stock'

export interface StockRepository {
  create(stock: Stock): Promise<void>
  findByContent(content: string):Promise<Stock | null>
  findById(id: string):Promise<Stock | null>
}
