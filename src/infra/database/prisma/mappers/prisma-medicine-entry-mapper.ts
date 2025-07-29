import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineEntry } from '@/domain/pharma/enterprise/entities/entry'
import { MedicineEntry as PrismaMedicineEntry, type Prisma } from 'prisma/generated'

export class PrismaMedicineEntryMapper {
  static toDomain(raw: PrismaMedicineEntry): MedicineEntry {
    return MedicineEntry.create({
      operatorId: new UniqueEntityId(raw.operatorId),
      stockId: new UniqueEntityId(raw.stockId),
      nfNumber: raw.nfNumber,
      entryDate: raw.entryDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(medicineEntry: MedicineEntry): Prisma.MedicineEntryUncheckedCreateInput {
    return {
      id: medicineEntry.id.toString(),
      operatorId: medicineEntry.operatorId.toString(),
      stockId: medicineEntry.stockId.toString(),
      nfNumber: medicineEntry.nfNumber,
      entryDate: medicineEntry.entryDate,
      createdAt: medicineEntry.createdAt,
      updatedAt: medicineEntry.updatedAt,
    }
  }
}
