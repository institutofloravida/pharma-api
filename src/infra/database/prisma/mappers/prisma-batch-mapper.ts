import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'
import { Batch as PrismaBatch, type Prisma } from 'prisma/generated'

export class PrismaBatchMapper {
  static toDomain(raw: PrismaBatch): Batch {
    return Batch.create(
      {
        code: raw.code,
        expirationDate: raw.expirationDate,
        manufacturerId: new UniqueEntityId(raw.manufacturerId),
        manufacturingDate: raw.manufacturingDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    batch: Batch,
  ): Prisma.BatchUncheckedCreateInput {
    return {
      id: batch.id.toString(),
      code: batch.code,
      expirationDate: batch.expirationDate,
      manufacturerId: batch.manufacturerId.toString(),
      manufacturingDate: batch.manufacturingDate,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    }
  }
}
