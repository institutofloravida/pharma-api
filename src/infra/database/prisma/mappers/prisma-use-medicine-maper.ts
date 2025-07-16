import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UseMedicine } from '@/domain/pharma/enterprise/entities/use-medicine'
import { UseMedicine as PrismaUseMedicine, type Prisma } from 'prisma/generated'

export class PrismaUseMedicineMapper {
  static toDomain(raw: PrismaUseMedicine): UseMedicine {
    return UseMedicine.create({
      year: raw.year,
      month: raw.month,
      medicineStockId: new UniqueEntityId(raw.medicineStockId),
      currentBalance: raw.currentBalance,
      previousBalance: raw.previousBalance,
      used: raw.used,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(usemedicine: UseMedicine): Prisma.UseMedicineUncheckedCreateInput {
    return {
      id: usemedicine.id.toString(),
      year: usemedicine.year,
      month: usemedicine.month,
      medicineStockId: usemedicine.medicineStockId.toString(),
      currentBalance: usemedicine.currentBalance,
      previousBalance: usemedicine.previousBalance,
      used: usemedicine.used,
      createdAt: usemedicine.createdAt,
      updatedAt: usemedicine.updatedAt,
    }
  }
}
