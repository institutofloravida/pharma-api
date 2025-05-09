import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'
import { Pathology as PrismaPathology, type Prisma } from 'prisma/generated/prisma'

export class PrismaPathologyMapper {
  static toDomain(raw: PrismaPathology): Pathology {
    return Pathology.create({
      content: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(pathology: Pathology): Prisma.PathologyUncheckedCreateInput {
    return {
      id: pathology.id.toString(),
      name: pathology.content,
      createdAt: pathology.createdAt,
      updatedAt: pathology.updatedAt,
    }
  }
}
