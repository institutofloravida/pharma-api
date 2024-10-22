import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Stock, type StockProps } from '@/domain/pharma/enterprise/entities/stock'
import { faker } from '@faker-js/faker'

export function makeStock(
  override: Partial<StockProps> = {},
  id?: UniqueEntityId,
) {
  const stock = Stock.create({
    content: faker.database.collation(),
    ...override,
  },
  id)

  return stock
}
