import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { TherapeuticClass as PrismaTherapeuticClass, type Prisma } from '@prisma/client'

export class PrismaTherapeuticClassMapper {
  static toDomain(raw: PrismaTherapeuticClass): TherapeuticClass {
    return TherapeuticClass.create({
      content: raw.name,
      description: raw.description,
      createdAt: raw.createdAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(therapeuticClass: TherapeuticClass): Prisma.TherapeuticClassCreateInput {
    return {
      id: therapeuticClass.id.toString(),
      name: therapeuticClass.content,
      description: therapeuticClass.description,
      createdAt: therapeuticClass.createdAt,
    }
  }
}
