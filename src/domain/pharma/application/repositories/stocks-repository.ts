import { Stock } from '../../enterprise/entities/stock'

export interface StocksRepository {
  create(stock: Stock): Promise<void>
  findByContent(content: string):Promise<Stock | null>
  findById(id: string):Promise<Stock | null>
}
