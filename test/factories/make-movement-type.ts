import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MovementType, type MovementTypeProps } from '@/domain/pharma/enterprise/entities/movement-type'
import { PrismaMovementTypeMapper } from '@/infra/database/prisma/mappers/prisma-movement-type-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class MovementTypeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMovementType(
    data: Partial<MovementTypeProps> = {},
  ): Promise<MovementType> {
    const movementType = makeMovementType({
      ...data,
    })

    await this.prisma.movementType.create({
      data: PrismaMovementTypeMapper.toPrisma(movementType),
    })

    return movementType
  }
}
