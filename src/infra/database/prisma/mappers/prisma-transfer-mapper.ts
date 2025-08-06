import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Transfer,
  TransferStatus,
} from '@/domain/pharma/enterprise/entities/transfer';
import {
  $Enums,
  Transfer as PrismaTransfer,
  type Prisma,
} from 'prisma/generated';

export class PrismaTransferMapper {
  static toDomain(raw: PrismaTransfer): Transfer {
    return Transfer.create(
      {
        status: TransferStatus[raw.status],
        stockDestinationId: new UniqueEntityId(raw.stockDestinationId),
        confirmedAt: raw.confirmedAt ? new Date(raw.confirmedAt) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(transfer: Transfer): Prisma.TransferUncheckedCreateInput {
    return {
      id: transfer.id.toString(),
      status: $Enums.TransferStatus[transfer.status],
      confirmedAt: transfer.confirmedAt
        ? transfer.confirmedAt.toISOString()
        : null,
      stockDestinationId: transfer.stockDestinationId.toString(),
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    };
  }
}
