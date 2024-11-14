import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Manufacturer, ManufacturerProps } from '@/domain/pharma/enterprise/entities/manufacturer'
import { PrismaManufacturerMapper } from '@/infra/database/prisma/mappers/prisma-manufacturer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeManufacturer(
  override: Partial<ManufacturerProps> = {},
  id?: UniqueEntityId,
) {
  const manufacturer = Manufacturer.create({
    cnpj: faker.string.numeric({ length: 14 }),
    content: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return manufacturer
}

@Injectable()
export class ManufacturerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaManufacturer(data: Partial<ManufacturerProps> = {}): Promise<Manufacturer> {
    const manufacturer = makeManufacturer({
      ...data,
    })

    await this.prisma.manufacturer.create({
      data: PrismaManufacturerMapper.toPrisma(manufacturer),
    })

    return manufacturer
  }
}
