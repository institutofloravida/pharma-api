import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineExit } from '@/domain/pharma/enterprise/entities/exit'
import { Exit as PrismaExit, type Prisma } from '@prisma/client'
export class PrismaMedicineExitMapper {
  static toDomain(raw: PrismaExit): MedicineExit {
    return MedicineExit.create({
      exitType: raw.exitType,
      batchestockId: new UniqueEntityId(raw.batchestockId),
      medicineStockId: new UniqueEntityId(raw.medicineStockId),
      operatorId: new UniqueEntityId(raw.operatorId),
      quantity: raw.quantity,
      exitDate: raw.exitDate,
      createdAt: raw.createdAt,
      dispensationId: raw.dispensationId
        ? new UniqueEntityId(raw.dispensationId)
        : null,
      updatedAt: raw.updatedAt ?? undefined,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(exit: MedicineExit): Prisma.ExitUncheckedCreateInput {
    return {
      id: exit.id.toString(),
      batchestockId: exit.batchestockId.toString(),
      exitType: exit.exitType,
      operatorId: exit.operatorId.toString(),
      medicineStockId: exit.medicineStockId.toString(),
      dispensationId: exit.dispensationId
        ? exit.dispensationId.toString()
        : null,
      quantity: exit.quantity,
      exitDate: exit.exitDate,
      createdAt: exit.createdAt,
      updatedAt: exit.updatedAt,
    }
  }
}
