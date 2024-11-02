import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Institution, type InstitutionProps } from '@/domain/pharma/enterprise/entities/institution'
import { PrismaInstitutionMapper } from '@/infra/database/prisma/mappers/prisma-institution-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeInstitution(
  override: Partial<InstitutionProps> = {},
  id?: UniqueEntityId,
) {
  const institution = Institution.create({
    cnpj: faker.string.numeric({ length: 14 }),
    content: faker.company.name(),
    description: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return institution
}

@Injectable()
export class InstitutionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaInstitution(data: Partial<InstitutionProps> = {}): Promise<Institution> {
    const institution = makeInstitution(data)

    await this.prisma.institution.create({
      data: PrismaInstitutionMapper.toPrisma(institution),
    })

    return institution
  }
}
