import { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class StockPresenter {
  static toHTTP(stock: Stock) {
    return {
      id: stock.id.toString(),
      name: stock.content,
      status: stock.isActive,
      institutionId: stock.institutionId.toString(),
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }
  }
}
