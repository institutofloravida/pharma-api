import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Institution, InstitutionType } from '@/domain/pharma/enterprise/entities/institution'
import { $Enums, Institution as PrismaInstitution, type Prisma } from 'prisma/generated'

export class PrismaInstitutionMapper {
  static toDomain(raw: PrismaInstitution): Institution {
    return Institution.create({
      content: raw.name,
      cnpj: raw.cnpj,
      controlStock: raw.controlStock,
      responsible: raw.responsible,
      type: InstitutionType[raw.type],
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
      controlStock: institution.controlStock,
      type: $Enums.InstitutionType[institution.type],
      responsible: institution.responsible,
      description: institution.description,
      cnpj: institution.cnpj,
      createdAt: institution.createdAt,
      updatedAt: institution.updatedAt,
    }
  }
}
