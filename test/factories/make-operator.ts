import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Operator, type OperatorProps } from '@/domain/pharma/enterprise/entities/operator'
import { faker } from '@faker-js/faker'

export function makeOperator(
  override: Partial<OperatorProps> = {},
  id?: UniqueEntityId,
) {
  const operator = Operator.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    ...override,
  },
  id)

  return operator
}
