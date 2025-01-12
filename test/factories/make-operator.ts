import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Operator, type OperatorProps } from '@/domain/pharma/enterprise/entities/operator'
import { PrismaOperatorMapper } from '@/infra/database/prisma/mappers/prisma-operator-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOperator(
  override: Partial<OperatorProps> = {},
  id?: UniqueEntityId,
) {
  const operator = Operator.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    institutionsIds: [],
    role: 'COMMON',
    ...override,
  },
  id)

  return operator
}

@Injectable()
export class OperatorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOperator(data: Partial<OperatorProps> = {}): Promise<Operator> {
    const operator = makeOperator({
      institutionsIds: data.institutionsIds,
      ...data,
    })

    await this.prisma.operator.create({
      data: PrismaOperatorMapper.toPrisma(operator),
    })

    return operator
  }
}
