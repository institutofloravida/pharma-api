import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MovementType, type MovementTypeProps } from '@/domain/pharma/enterprise/entities/movement-type'
import { faker } from '@faker-js/faker'

export function makeMovementType(
  override: Partial<MovementTypeProps> = {},
  id?: UniqueEntityId,
) {
  const randomDirection = (): 'ENTRY' | 'EXIT' => {
    const directions: ('ENTRY' | 'EXIT')[] = ['ENTRY', 'EXIT']
    return directions[Math.floor(Math.random() * directions.length)]
  }

  const movementType = MovementType.create(
    {
      direction: randomDirection(),
      content: faker.finance.transactionType(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,
  )

  return movementType
}
