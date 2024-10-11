import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Pathology, type PathologyProps } from '@/domain/pharma/enterprise/entities/pathology'
import { faker } from '@faker-js/faker'

export function makePathology(
  override: Partial<PathologyProps> = {},
  id?: UniqueEntityId,
) {
  const pathology = Pathology.create({
    content: faker.lorem.sentence(),
    ...override,
  },
  id)

  return pathology
}
