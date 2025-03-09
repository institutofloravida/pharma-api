import { StockWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/stock-with-institution'

export class StockWithInstitutionPresenter {
  static toHTTP(stock: StockWithInstitution,
  ) {
    return {
      id: stock.id.toString(),
      name: stock.content,
      status: stock.status,
      institutionName: stock.institutionName,
      institutionId: stock.institutionId.toString(),
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }
  }
}
