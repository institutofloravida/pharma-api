import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'

export class ManufacturerPresenter {
  static toHTTP(manufacturer: Manufacturer) {
    return {
      id: manufacturer.id.toString(),
      name: manufacturer.content,
      cnpj: manufacturer.cnpj,
      description: manufacturer.description,
    }
  }
}
