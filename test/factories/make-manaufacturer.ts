import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Manufacturer, ManufacturerProps } from '@/domain/pharma/enterprise/entities/manufacturer'
import { faker } from '@faker-js/faker'

export function makeManufacturer(
  override: Partial<ManufacturerProps> = {},
  id?: UniqueEntityId,
) {
  const manufacturer = Manufacturer.create({
    content: faker.commerce.department(),
    cnpj: faker.string.numeric({length: 14}),
    description: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return manufacturer
}
