import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit';
import { $Enums, Exit as PrismaExit, type Prisma } from 'prisma/generated';
export class PrismaMedicineExitMapper {
  static toDomain(raw: PrismaExit): MedicineExit {
    return MedicineExit.create(
      {
        exitType: ExitType[raw.exitType],
        operatorId: new UniqueEntityId(raw.operatorId),
        exitDate: raw.exitDate,
        movementTypeId: raw.movementTypeId
          ? new UniqueEntityId(raw.movementTypeId)
          : undefined,
        transferId: raw.transferId
          ? new UniqueEntityId(raw.transferId)
          : undefined,
        destinationInstitutionId: raw.destinationInstitutionId
          ? new UniqueEntityId(raw.destinationInstitutionId)
          : null,
        dispensationId: raw.dispensationId
          ? new UniqueEntityId(raw.dispensationId)
          : undefined,
        stockId: new UniqueEntityId(raw.stockId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(exit: MedicineExit): Prisma.ExitUncheckedCreateInput {
    return {
      id: exit.id.toString(),
      exitType: $Enums.ExitType[exit.exitType],
      operatorId: exit.operatorId.toString(),
      stockId: exit.stockId.toString(),
      transferId: exit.transferId ? exit.transferId.toString() : null,
      movementTypeId: exit.movementTypeId?.toString(),
      dispensationId: exit.dispensationId
        ? exit.dispensationId.toString()
        : null,
      destinationInstitutionId: exit.destinationInstitutionId
        ? exit.destinationInstitutionId.toString()
        : null,
      exitDate: exit.exitDate,
      createdAt: exit.createdAt,
      updatedAt: exit.updatedAt,
    };
  }
}
