import { PaginationParams } from '@/core/repositories/pagination-params'
import { Stock } from '../../enterprise/entities/stock'
import type { Meta } from '@/core/repositories/meta'

export interface StockWithInstitution {
  stock: Stock
  institutionName: string
}

export abstract class StocksRepository {
  abstract create(stock: Stock): Promise<void>
  abstract findByContent(content: string, institutionId: string):Promise<Stock | null>
  abstract findById(id: string):Promise<Stock | null>
  abstract findManyWithInstitution(
    params: PaginationParams,
    institutionsIds: string[],
    content?: string,
    isSuper?: boolean
  ): Promise<{ stocks: StockWithInstitution[], meta: Meta }>
}
