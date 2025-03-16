import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Address, type AddressProps } from '@/domain/pharma/enterprise/entities/address'
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/prisma-address-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityId,
) {
  const address = Address.create({
    city: faker.location.city(),
    number: faker.location.buildingNumber(),
    neighborhood: faker.location.county(),
    state: faker.location.state({ abbreviated: true }),
    street: faker.location.street(),
    zipCode: faker.location.zipCode(),
    ...override,
  },
  id)

  return address
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const Address = makeAddress({
      ...data,
    })

    await this.prisma.address.create({
      data: PrismaAddressMapper.toPrisma(Address),
    })

    return Address
  }
}
