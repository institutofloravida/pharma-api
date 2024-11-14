import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PharmaceuticalForm, type PharmaceuticalFormProps } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import { PrismaPharmaceuticalFormMapper } from '@/infra/database/prisma/mappers/prisma-pharmaceutical-form'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makePharmaceuticalForm(
  override: Partial<PharmaceuticalFormProps> = {},
  id?: UniqueEntityId,
) {
  const pharmaceuticalform = PharmaceuticalForm.create({
    content: faker.science.chemicalElement.name,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return pharmaceuticalform
}

@Injectable()
export class PharmaceuticalFormFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPharmaceuticalForm(data: Partial<PharmaceuticalFormProps> = {}): Promise<PharmaceuticalForm> {
    const pharmaceuticalform = makePharmaceuticalForm(data)

    await this.prisma.pharmaceuticalForm.create({
      data: PrismaPharmaceuticalFormMapper.toPrisma(pharmaceuticalform),
    })

    return pharmaceuticalform
  }
}
