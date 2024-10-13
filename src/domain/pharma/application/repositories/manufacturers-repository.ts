import { Manufacturer } from '../../enterprise/entities/manufacturer'

export interface ManufacturersRepository {
  create(manufacturer: Manufacturer): Promise<void>
  findByContent(content: string): Promise<Manufacturer | null>
  findByCnpj(cnpj: string): Promise<Manufacturer | null>
}
