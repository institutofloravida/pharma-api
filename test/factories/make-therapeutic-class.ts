import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { TherapeuticClass, type TherapeuticClassProps } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { PrismaTherapeuticClassMapper } from '@/infra/database/prisma/mappers/prisma-therapeutic-class.mapper'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeTherapeuticClass(
  override: Partial<TherapeuticClassProps> = {},
  id?: UniqueEntityId,
) {
  const therapeuticclass = TherapeuticClass.create({
    content: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return therapeuticclass
}

@Injectable()
export class TherapeuticClassFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTherapeuticClass(data: Partial<TherapeuticClassProps> = {}): Promise<TherapeuticClass> {
    const therapeuticclass = makeTherapeuticClass(data)
    await this.prisma.therapeuticClass.create({
      data: PrismaTherapeuticClassMapper.toPrisma(therapeuticclass),
    })

    return therapeuticclass
  }
}
