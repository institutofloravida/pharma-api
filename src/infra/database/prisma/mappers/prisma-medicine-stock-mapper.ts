import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { MedicineStock as PrismaMedicineStock, type Prisma } from '@prisma/client'

export class PrismaMedicineStockMapper {
  static toDomain(raw: PrismaMedicineStock & { batchesStocks: { id: string }[] }): MedicineStock {
    return MedicineStock.create({
      batchesStockIds: raw.batchesStocks.map(item => new UniqueEntityId(item.id.toString())),
      currentQuantity: raw.currentQuantity,
      medicineVariantId: new UniqueEntityId(raw.medicineVariantId),
      stockId: new UniqueEntityId(raw.stockId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(medicineStock: MedicineStock): Prisma.MedicineStockUncheckedCreateInput {
    return {
      id: medicineStock.id.toString(),
      stockId: medicineStock.stockId.toString(),
      medicineVariantId: medicineStock.medicineVariantId.toString(),
      currentQuantity: medicineStock.quantity,
      batchesStocks: {
        connect: medicineStock.batchesStockIds.map(item => {
          return {
            id: item.toString(),
          }
        }),
      },
      lastMove: medicineStock.lastMove,
      minimumLevel: medicineStock.minimumLevel,
      createdAt: medicineStock.createdAt,
      updatedAt: medicineStock.updatedAt,
    }
  }
}
