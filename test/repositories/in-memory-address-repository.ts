import { AddresssRepository } from '@/domain/pharma/application/repositories/address-repository'
import { Address } from '@/domain/pharma/enterprise/entities/address'

export class InMemoryAddressRepository implements AddresssRepository {
  public items: Address[] = []

  async create(address: Address): Promise<void> {
    this.items.push(address)
  }
}
