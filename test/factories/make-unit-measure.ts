import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnitMeasure, UnitMeasureProps } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { PrismaUnitMeasureMapper } from '@/infra/database/prisma/mappers/prisma-unit-measure-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeUnitMeasure(
  override: Partial<UnitMeasureProps> = {},
  id?: UniqueEntityId,
) {
  const unitMeasure = UnitMeasure.create({
    acronym: faker.string.alpha({ length: 2 }),
    content: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return unitMeasure
}

@Injectable()
export class UnitMeasureFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUnitMeasure(data: Partial<UnitMeasureProps> = {}): Promise<UnitMeasure> {
    const unitmeasure = makeUnitMeasure({
      ...data,
    })

    await this.prisma.unitMeasure.create({
      data: PrismaUnitMeasureMapper.toPrisma(unitmeasure),
    })

    return unitmeasure
  }
}
