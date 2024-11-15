import { PaginationParams } from '@/core/repositories/pagination-params'
import { Manufacturer } from '../../enterprise/entities/manufacturer'

export abstract class ManufacturersRepository {
  abstract create(manufacturer: Manufacturer): Promise<void>
  abstract findByContent(content: string): Promise<Manufacturer | null>
  abstract findByCnpj(cnpj: string): Promise<Manufacturer | null>
  abstract findMany(params: PaginationParams): Promise<Manufacturer[]>
}
