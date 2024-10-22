import { OperatorsRepository } from '@/domain/pharma/application/repositories/operators-repository'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOperatorMapper } from '../mappers/prisma-operator-mapper'

@Injectable()
export class PrismaOperatorsRepository implements OperatorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(operator: Operator): Promise<void> {
    const data = PrismaOperatorMapper.toPrisma(operator)
    await this.prisma.operator.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Operator | null> {
    const operator = await this.prisma.operator.findUnique({
      where: {
        email,
      },
    })

    if (!operator) {
      return null
    }

    return PrismaOperatorMapper.toDomain(operator)
  }
}
