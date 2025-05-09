import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { Manufacturer as PrismaManufacturer, type Prisma } from 'prisma/generated/prisma'

export class PrismaManufacturerMapper {
  static toDomain(raw: PrismaManufacturer): Manufacturer {
    return Manufacturer.create({
      content: raw.name,
      cnpj: raw.cnpj,
      description: raw.description,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(manufacturer: Manufacturer): Prisma.ManufacturerUncheckedCreateInput {
    return {
      id: manufacturer.id.toString(),
      name: manufacturer.content,
      description: manufacturer.description,
      cnpj: manufacturer.cnpj,
      createdAt: manufacturer.createdAt,
      updatedAt: manufacturer.updatedAt,
    }
  }
}
