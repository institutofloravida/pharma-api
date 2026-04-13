import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation';
import {
  Movimentation as PrismaMovimentation,
  type Prisma,
} from 'prisma/generated';
export class PrismaMovimentationMapper {
  static toDomain(raw: PrismaMovimentation): Movimentation {
    return Movimentation.create(
      {
        batchStockId: new UniqueEntityId(raw.batchStockId),
        direction: raw.direction,
        quantity: raw.quantity,
        entryId: raw.entryId ? new UniqueEntityId(raw.entryId) : undefined,
        exitId: raw.exitId ? new UniqueEntityId(raw.exitId) : undefined,
        correctionEntryId: raw.correctionEntryId
          ? new UniqueEntityId(raw.correctionEntryId)
          : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    movimentation: Movimentation,
  ): Prisma.MovimentationUncheckedCreateInput {
    return {
      id: movimentation.id.toString(),
      batchStockId: movimentation.batchestockId.toString(),
      direction: movimentation.direction,
      quantity: movimentation.quantity,
      entryId: movimentation.entryId?.toString(),
      exitId: movimentation.exitId?.toString(),
      correctionEntryId: movimentation.correctionEntryId?.toString(),
      createdAt: movimentation.createdAt,
      updatedAt: movimentation.updatedAt,
    };
  }
}
