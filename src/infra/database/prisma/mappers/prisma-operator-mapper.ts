import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Operator, OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { $Enums, Operator as PrismaOperator, type Prisma } from 'prisma/generated/prisma'

export class PrismaOperatorMapper {
  static toDomain(
    raw: PrismaOperator & { institutions: { id: string }[] },
  ): Operator {
    return Operator.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        institutionsIds: raw.institutions.map(inst => new UniqueEntityId(inst.id)),
        role: OperatorRole[raw.role],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(operator: Operator): Prisma.OperatorUncheckedCreateInput {
    return {
      id: operator.id.toString(),
      name: operator.name,
      email: operator.email,
      passwordHash: operator.passwordHash,
      role: $Enums.OperatorRole[operator.role],
      createdAt: operator.createdAt,
      updatedAt: operator.updatedAt,
      institutions: {
        connect: operator.institutionsIds.map((id) => ({ id: id.toString() })),
      },
    }
  }
}
