import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Medicine, type MedicineProps } from '@/domain/pharma/enterprise/entities/medicine'
import { PrismaMedicineMapper } from '@/infra/database/prisma/mappers/prisma-medicine-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeMedicine(
  override: Partial<MedicineProps> = {},
  id?: UniqueEntityId,
) {
  const medicine = Medicine.create({
    content: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    therapeuticClassesIds: Array.from({ length: 3 }, () => new UniqueEntityId()),
    medicinesVariantsIds: Array.from({ length: 2 }, () => new UniqueEntityId()),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return medicine
}

@Injectable()
export class MedicineFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMedicine(data: Partial<MedicineProps> = {}): Promise<Medicine> {
    const medicine = makeMedicine(data)

    await this.prisma.medicine.create({
      data: {
        ...PrismaMedicineMapper.toPrisma(medicine),
        medicineVariants: {
        },

      },
    })

    return medicine
  }
}
