import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/pharma/enterprise/entities/address'
import { Address as PrismaAddress, type Prisma } from '@prisma/client'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create({
      city: raw.city,
      neighborhood: raw.neighborhood,
      number: raw.number,
      state: raw.state,
      street: raw.street,
      zipCode: raw.zipCode,
      complement: raw.complement,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      city: address.city,
      complement: address.complement,
      id: address.id.toString(),
      neighborhood: address.neighborhood,
      number: address.number,
      state: address.state,
      street: address.street,
      zipCode: address.zipCode,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }
  }
}
