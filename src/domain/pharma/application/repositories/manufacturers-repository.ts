import { PaginationParams } from '@/core/repositories/pagination-params'
import { Manufacturer } from '../../enterprise/entities/manufacturer'
import type { Meta } from '@/core/repositories/meta'

export abstract class ManufacturersRepository {
  abstract create(manufacturer: Manufacturer): Promise<void>
  abstract findByContent(content: string): Promise<Manufacturer | null>
  abstract findByCnpj(cnpj: string): Promise<Manufacturer | null>
  abstract findMany(
    params: PaginationParams,
    content?: string,
    cnpj?: string,
  ): Promise<{ manufacturers: Manufacturer[]; meta: Meta }>
}
