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
      stockDestinationId: transfer.stockDestinationId.toString(),
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    };
  }
}
