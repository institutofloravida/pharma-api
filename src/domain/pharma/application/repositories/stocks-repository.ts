import { PaginationParams } from '@/core/repositories/pagination-params'
import { Stock } from '../../enterprise/entities/stock'

export abstract class StocksRepository {
  abstract create(stock: Stock): Promise<void>
  abstract findByContent(content: string, institutionId: string):Promise<Stock | null>
  abstract findById(id: string):Promise<Stock | null>
  abstract findManyByInstitutionsId(params: PaginationParams, institutionsIds?: string[]):Promise<Stock[]>
}
