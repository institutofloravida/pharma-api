import { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class StockPresenter {
  static toHTTP(stock: Stock) {
    return {
      id: stock.id.toString(),
      name: stock.content,
      status: stock.isActive,
    }
  }
}
