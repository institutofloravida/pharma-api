import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineEntry, type MedicineEntryProps } from '@/domain/pharma/enterprise/entities/entry'
import { PrismaMedicineEntryMapper } from '@/infra/database/prisma/mappers/prisma-medicine-entry-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeMedicineEntry(
  override: Partial<MedicineEntryProps> = {},
  id?: UniqueEntityId,
) {
  const medicineentry = MedicineEntry.create({
    batcheStockId: new UniqueEntityId(),
    medicineStockId: new UniqueEntityId(),
    entryDate: new Date(),
    movementTypeId: new UniqueEntityId(),
    operatorId: new UniqueEntityId(),
    quantity: faker.number.int({ max: 100, min: 1 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return medicineentry
}

@Injectable()
export class MedicineEntryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMedicineEntry(data: Partial<MedicineEntryProps> = {}): Promise<MedicineEntry> {
    const medicineentry = makeMedicineEntry(
      data,
    )

    await this.prisma.medicineEntry.create({
      data: PrismaMedicineEntryMapper.toPrisma(medicineentry),
    })

    return medicineentry
  }
}
