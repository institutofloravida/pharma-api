import { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class StockPresenter {
  static toHTTP({ stock, institutionName }: { stock: Stock } & { institutionName: string | null },
  ) {
    return {
      id: stock.id.toString(),
      name: stock.content,
      status: stock.isActive,
      institutionName,
    }
  }
}
