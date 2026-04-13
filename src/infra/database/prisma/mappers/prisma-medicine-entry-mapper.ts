import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  EntryType,
  MedicineEntry,
} from '@/domain/pharma/enterprise/entities/entry';
import {
  $Enums,
  MedicineEntry as PrismaMedicineEntry,
  type Prisma,
} from 'prisma/generated';

export class PrismaMedicineEntryMapper {
  static toDomain(raw: PrismaMedicineEntry): MedicineEntry {
    return MedicineEntry.create(
      {
        operatorId: new UniqueEntityId(raw.operatorId),
        stockId: new UniqueEntityId(raw.stockId),
        nfNumber: raw.nfNumber ?? undefined,
        entryType: EntryType[raw.entryType],
        movementTypeId: raw.movementTypeId
          ? new UniqueEntityId(raw.movementTypeId)
          : undefined,
        transferId: raw.transferId ? new UniqueEntityId(raw.transferId) : null,
        correctionOfEntryId: raw.correctionOfEntryId
          ? new UniqueEntityId(raw.correctionOfEntryId)
          : null,
        correctedAt: raw.correctedAt ?? null,
        entryDate: raw.entryDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    medicineEntry: MedicineEntry,
  ): Prisma.MedicineEntryUncheckedCreateInput {
    return {
      id: medicineEntry.id.toString(),
      operatorId: medicineEntry.operatorId.toString(),
      stockId: medicineEntry.stockId.toString(),
      nfNumber: medicineEntry.nfNumber ?? undefined,
      entryType: $Enums.EntryType[medicineEntry.entryType],
      movementTypeId: medicineEntry.movementTypeId?.toString(),
      transferId: medicineEntry.transferId
        ? medicineEntry.transferId.toString()
        : null,
      correctionOfEntryId:
        medicineEntry.correctionOfEntryId?.toString() ?? null,
      correctedAt: medicineEntry.correctedAt ?? null,
      entryDate: medicineEntry.entryDate,
      createdAt: medicineEntry.createdAt,
      updatedAt: medicineEntry.updatedAt,
    };
  }
}
