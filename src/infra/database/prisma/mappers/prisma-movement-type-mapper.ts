import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MovementType } from '@/domain/pharma/enterprise/entities/movement-type'
import { MovementType as PrismaMovementType, type Prisma } from '@prisma/client'

export class PrismaMovementTypeMapper {
  static toDomain(raw: PrismaMovementType): MovementType {
    return MovementType.create({
      content: raw.name,
      direction: raw.direction,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(movementType: MovementType):Prisma.MovementTypeUncheckedCreateInput {
    return {
      id: movementType.id.toString(),
      name: movementType.content,
      direction: movementType.direction,
      createdAt: movementType.createdAt,
      updatedAt: movementType.updatedAt,
    }
  }
}
