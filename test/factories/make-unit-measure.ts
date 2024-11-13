import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnitMeasure, UnitMeasureProps } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { faker } from '@faker-js/faker'

export function makeUnitMeasure(
  override: Partial<UnitMeasureProps> = {},
  id?: UniqueEntityId,
) {
  const unitMeasure = UnitMeasure.create({
    acronym: faker.string.alpha({length:2}),
    content: faker.lorem.sentence(),   
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return unitMeasure
}
