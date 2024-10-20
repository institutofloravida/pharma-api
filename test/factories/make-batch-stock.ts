import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { BatchStock, type BatchStockProps } from '@/domain/pharma/enterprise/entities/batch-stock'
import { faker } from '@faker-js/faker'

export function makeBatchStock(
  override: Partial<BatchStockProps> = {},
  id?: UniqueEntityId,
) {
  const batchStock = BatchStock.create({
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

  return batchStock
}
