import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStock, type MedicineStockProps } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { faker } from '@faker-js/faker'

export function makeMedicineStock(
  override: Partial<MedicineStockProps> = {},
  id?: UniqueEntityId,
) {
  const medicineStock = MedicineStock.create({
    medicineVariantId: new UniqueEntityId(),
    stockId: new UniqueEntityId(),
    currentQuantity: 0,
    minimumLevel: faker.number.int({ min: 1, max: 100 }),
    batchesStockIds: Array.from({ length: 3 }, () => new UniqueEntityId()),
    lastMove: faker.date.recent(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id,
  )

  return medicineStock
}
