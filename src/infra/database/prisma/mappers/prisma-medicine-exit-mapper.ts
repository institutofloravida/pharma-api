import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ExitType, MedicineExit } from '@/domain/pharma/enterprise/entities/exit'
import { Exit as PrismaExit, type Prisma } from 'prisma/generated'
export class PrismaMedicineExitMapper {
  static toDomain(raw: PrismaExit): MedicineExit {
    return MedicineExit.create({
      exitType: ExitType[raw.exitType],
      operatorId: new UniqueEntityId(raw.operatorId),
      exitDate: raw.exitDate,
      stockId: new UniqueEntityId(raw.stockId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(exit: MedicineExit): Prisma.ExitUncheckedCreateInput {
    return {
      id: exit.id.toString(),
      exitType: exit.exitType,
      operatorId: exit.operatorId.toString(),
      stockId: exit.stockId.toString(),
      exitDate: exit.exitDate,
      createdAt: exit.createdAt,
      updatedAt: exit.updatedAt,
    }
  }
}
