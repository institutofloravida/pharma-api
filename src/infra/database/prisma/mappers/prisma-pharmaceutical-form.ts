import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import { PharmaceuticalForm as PrismaPharmaceuticalForm, Prisma } from 'prisma/generated'

export class PrismaPharmaceuticalFormMapper {
  static toDomain(raw: PrismaPharmaceuticalForm): PharmaceuticalForm {
    return PharmaceuticalForm.create(
      {
        content: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(pharmaceuticalForm: PharmaceuticalForm): Prisma.PharmaceuticalFormCreateInput {
    return {
      id: pharmaceuticalForm.id.toString(),
      name: pharmaceuticalForm.content,
      createdAt: pharmaceuticalForm.createdAt,
      updatedAt: pharmaceuticalForm.updatedAt,
    }
  }
}
