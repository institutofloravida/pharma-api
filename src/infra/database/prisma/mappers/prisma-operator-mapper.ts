import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { Operator as PrismaOperator, type Prisma } from '@prisma/client'

export class PrismaOperatorMapper {
  static toDomain(raw: PrismaOperator): Operator {
    return Operator.create({
      name: raw.name,
      email: raw.email,
      passwordHash: raw.passwordHash,
      role: raw.role,
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
      role: operator.role,
      createdAt: operator.createdAt,
      updatedAt: operator.updatedAt,
    }
  }
}
