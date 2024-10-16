import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Medicine, type MedicineProps } from '@/domain/pharma/enterprise/entities/medicine'
import { faker } from '@faker-js/faker'

export function makeMedicine(
  override: Partial<MedicineProps> = {},
  id?: UniqueEntityId,
) {
  const medicine = Medicine.create({
    content: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    dosage: `${faker.number.int({ min: 1, max: 500 })}mg`,
    pharmaceuticalFormId: new UniqueEntityId(),
    therapeuticClassesIds: Array.from({ length: 3 }, () => new UniqueEntityId()),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return medicine
}
