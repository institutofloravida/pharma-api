import { PaginationParams } from '@/core/repositories/pagination-params';
import { Stock } from '../../enterprise/entities/stock';
import { Meta } from '@/core/repositories/meta';
import { StockWithInstitution } from '../../enterprise/entities/value-objects/stock-with-institution';

export abstract class StocksRepository {
  abstract create(stock: Stock): Promise<void>;
  abstract save(stock: Stock): Promise<void>;
  abstract findByContent(
    content: string,
    institutionId: string,
  ): Promise<Stock | null>;
  abstract findById(id: string): Promise<Stock | null>;
  abstract findByIdWithDetails(
    id: string,
  ): Promise<StockWithInstitution | null>;
  abstract findManyWithInstitution(
    params: PaginationParams,
    institutionsIds: string[],
    content?: string,
    isSuper?: boolean,
  ): Promise<{ stocks: StockWithInstitution[]; meta: Meta }>;
}
