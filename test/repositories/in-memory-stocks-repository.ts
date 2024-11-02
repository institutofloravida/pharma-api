import { StocksRepository } from '@/domain/pharma/application/repositories/stocks-repository'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class InMemoryStocksRepository implements StocksRepository {
  public items: Stock[] = []

  async create(stock: Stock) {
    this.items.push(stock)
  }

  async findByContent(content: string, institutionId: string) {
    const stock = this.items.find(item => (item.content.toLowerCase().trim() === content.toLowerCase().trim()) && item.institutionId.toString() === institutionId)
    if (!stock) {
      return null
    }

    return stock
  }

  async findById(id: string) {
    const stock = this.items.find(item => item.id.toString() === id)
    if (!stock) {
      return null
    }

    return stock
  }
}
