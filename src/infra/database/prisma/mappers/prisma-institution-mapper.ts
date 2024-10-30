import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Institution as PrismaInstitution, type Prisma } from '@prisma/client'

export class PrismaInstitutionMapper {
  static toDomain(raw: PrismaInstitution): Institution {
    return Institution.create({
      content: raw.name,
      cnpj: raw.cnpj,
      description: raw.description,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(institution: Institution): Prisma.InstitutionUncheckedCreateInput {
    return {
      id: institution.id.toString(),
      name: institution.content,
      description: institution.description,
      cnpj: institution.cnpj,
      createdAt: institution.createdAt,
      updatedAt: institution.updatedAt,
    }
  }
}
