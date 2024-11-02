import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Batchestock, type BatchestockProps } from '@/domain/pharma/enterprise/entities/batch-stock'
import { faker } from '@faker-js/faker'

export function makeBatchestock(
  override: Partial<BatchestockProps> = {},
  id?: UniqueEntityId,
) {
  const batchestock = Batchestock.create({
    medicineId: new UniqueEntityId(),
    stockId: new UniqueEntityId(),
    batchId: new UniqueEntityId(),
    currentQuantity: 0,
    lastMove: faker.date.recent(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return batchestock
}
