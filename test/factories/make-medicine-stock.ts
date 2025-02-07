import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  MedicineStock,
  type MedicineStockProps,
} from '@/domain/pharma/enterprise/entities/medicine-stock'
import { PrismaMedicineStockMapper } from '@/infra/database/prisma/mappers/prisma-medicine-stock-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeMedicineStock(
  override: Partial<MedicineStockProps> = {},
  id?: UniqueEntityId,
) {
  const medicineStock = MedicineStock.create(
    {
      medicineVariantId: new UniqueEntityId(),
      stockId: new UniqueEntityId(),
      currentQuantity: 0,
      minimumLevel: faker.number.int({ min: 1, max: 100 }),
      batchesStockIds: [],
      lastMove: faker.date.recent(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,
  )

  return medicineStock
}

@Injectable()
export class MedicineStockFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMedicineStock(
    data: Partial<MedicineStockProps> = {},
  ): Promise<MedicineStock> {
    const medicineStock = makeMedicineStock(data)
    await this.prisma.medicineStock.create({
      data: PrismaMedicineStockMapper.toPrisma(medicineStock),
    })

    return medicineStock
  }

  async updatePrismaMedicineStock(medicineStockId: string,
    data: Partial<MedicineStockProps> = {},
  ): Promise<MedicineStock> {
    const medicineStock = makeMedicineStock(data)

    await this.prisma.medicineStock.update({
      where: {
        id: medicineStockId,
      },
      data: PrismaMedicineStockMapper.toPrisma(medicineStock),
    })

    return medicineStock
  }
}
