import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { MedicineStock as PrismaMedicineStock, type Prisma } from '@prisma/client'

export class PrismaMedicineStockMapper {
  static toDomain(raw: PrismaMedicineStock): MedicineStock {
    return MedicineStock.create({
      batchesStockIds: raw.batchesStockIds.map(item => new UniqueEntityId(item)),
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
      batchesStockIds: medicineStock.batchesStockIds.map(item => item.toString()),
      lastMove: medicineStock.lastMove,
      minimumLevel: medicineStock.minimumLevel,
      createdAt: medicineStock.createdAt,
      updatedAt: medicineStock.updatedAt,
    }
  }
}
