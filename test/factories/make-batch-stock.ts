import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { BatchStock, type BatchestockProps } from '@/domain/pharma/enterprise/entities/batch-stock'
import { faker } from '@faker-js/faker'

export function makeBatchStock(
  override: Partial<BatchestockProps> = {},
  id?: UniqueEntityId,
) {
  const batchstock = BatchStock.create({
    medicineVariantId: new UniqueEntityId(),
    stockId: new UniqueEntityId(),
    batchId: new UniqueEntityId(),
    currentQuantity: 0,
    lastMove: faker.date.recent(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return batchstock
}
