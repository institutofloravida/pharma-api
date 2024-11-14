import { PaginationParams } from '@/core/repositories/pagination-params'
import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import { StocksRepository, type StockWithInstitution } from '@/domain/pharma/application/repositories/stocks-repository'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class InMemoryStocksRepository implements StocksRepository {
  constructor(
    private institutionsRepository: InstitutionsRepository,
  ) {}

  public items: Stock[] = []

  async create(stock: Stock) {
    this.items.push(stock)
  }

  async findByContent(content: string, institutionId: string) {
    const stock = this.items.find(
      (item) =>
        item.content.toLowerCase().trim() === content.toLowerCase().trim() &&
        item.institutionId.toString() === institutionId,
    )
    if (!stock) {
      return null
    }
    return stock
  }

  async findById(id: string) {
    const stock = this.items.find((item) => item.id.toString() === id)
    if (!stock) {
      return null
    }
    return stock
  }

  async findManyByInstitutionsId({ page }: PaginationParams, institutionsIds: string[]): Promise<Stock[]> {
    const stocks = this.items
      .filter((item) => institutionsIds.includes(item.institutionId.toString()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return stocks
  }

  async findManyWithInstitution({ page }: PaginationParams, institutionsIds: string[], isSuper = false): Promise<StockWithInstitution[]> {
    let stocks = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    if (!isSuper) {
      stocks = stocks.filter((item) =>
        institutionsIds
          ? institutionsIds.includes(item.institutionId.toString())
          : false,
      )
    }

    stocks = stocks.slice((page - 1) * 20, page * 20)

    const stocksWithInstitution = await Promise.all(
      stocks.map(async (stock) => {
        const institution = await this.institutionsRepository.findById(stock.institutionId.toString())

        return {
          stock,
          institutionName: institution
            ? institution.content
            : '',
        }
      }),
    )

    return stocksWithInstitution
  }
}
