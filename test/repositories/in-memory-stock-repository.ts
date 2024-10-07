import type { StockRepository } from '@/domain/pharma/application/repositories/stock-repository'
import type { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class InMemoryStockRepository implements StockRepository {
  public items: Stock[] = []

  async create(stock: Stock) {
    this.items.push(stock)
  }

  async findByContent(content: string) {
    const stock = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!stock) {
      return null
    }

    return stock
  }
}
