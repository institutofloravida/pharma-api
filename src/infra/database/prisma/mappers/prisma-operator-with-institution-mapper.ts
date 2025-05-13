import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution'
import { Operator as PrismaOperator } from 'prisma/generated'

type PrismaOperatorWithInstitutions = PrismaOperator & {
  institutions: {
    id: string,
    name: string
  }[]
}

export class PrismaOperatorWithInstitutionsMapper {
  static toDomain(
    raw: PrismaOperatorWithInstitutions,
  ): OperatorWithInstitution {
    return OperatorWithInstitution.create({
      id: new UniqueEntityId(raw.id),
      email: raw.email,
      name: raw.name,
      role: OperatorRole[raw.role],
      institutions: raw.institutions.map((institution) => {
        return {
          id: new UniqueEntityId(institution.id),
          name: institution.name,
        }
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
