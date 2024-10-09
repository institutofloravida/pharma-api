import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Batch, type BatchProps } from '@/domain/pharma/enterprise/entities/batch'
import { faker } from '@faker-js/faker'

export function makeBatch(
  override: Partial<BatchProps> = {},
  id?: UniqueEntityId,
) {
  const batch = Batch.create({
    manufacturerId: new UniqueEntityId(),
    code: faker.string.alphanumeric({ length: 8 }),
    expirationDate: faker.date.future(),
    manufacturingDate: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return batch
}
