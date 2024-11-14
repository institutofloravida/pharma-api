import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { UnitMeasure as PrismaUnitMeasure, type Prisma } from '@prisma/client'

export class PrismaUnitMeasureMapper {
  static toDomain(raw: PrismaUnitMeasure): UnitMeasure {
    return UnitMeasure.create({
      content: raw.name,
      acronym: raw.acronym,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(unitmeasure: UnitMeasure): Prisma.UnitMeasureUncheckedCreateInput {
    return {
      id: unitmeasure.id.toString(),
      name: unitmeasure.content,
      acronym: unitmeasure.acronym,
      createdAt: unitmeasure.createdAt,
      updatedAt: unitmeasure.updatedAt,
    }
  }
}
