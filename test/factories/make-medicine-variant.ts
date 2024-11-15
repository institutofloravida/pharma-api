import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineVariant, type MedicineVariantProps } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { PrismaMedicineVariantMapper } from '@/infra/database/prisma/mappers/prisma-medicine-variant-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeMedicineVariant(
  override: Partial<MedicineVariantProps> = {},
  id?: UniqueEntityId,
) {
  const medicineVariant = MedicineVariant.create({
    dosage: `${faker.number.int({ min: 1, max: 500 })}mg`,
    pharmaceuticalFormId: new UniqueEntityId(),
    medicineId: new UniqueEntityId(),
    unitMeasureId: new UniqueEntityId(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return medicineVariant
}

@Injectable()
export class MedicineVariantFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMedicineVariant(data: Partial<MedicineVariantProps> = {}): Promise<MedicineVariant> {
    const medicineVariant = makeMedicineVariant(data)

    await this.prisma.medicineVariant.create({
      data: {
        ...PrismaMedicineVariantMapper.toPrisma(medicineVariant),
      },
    })

    return medicineVariant
  }
}
