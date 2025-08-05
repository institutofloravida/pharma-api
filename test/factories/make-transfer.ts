import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Transfer,
  TransferStatus,
  type TransferProps,
} from '@/domain/pharma/enterprise/entities/transfer';
import { PrismaTransferMapper } from '@/infra/database/prisma/mappers/prisma-transfer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeTransfer(
  override: Partial<TransferProps> = {},
  id?: UniqueEntityId,
) {
  const transfer = Transfer.create(
    {
      status: TransferStatus.PENDING,
      stockDestinationId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return transfer;
}

@Injectable()
export class TransferFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTransfer(
    data: Partial<TransferProps> = {},
  ): Promise<Transfer> {
    const transfer = makeTransfer({
      ...data,
    });

    await this.prisma.transfer.create({
      data: PrismaTransferMapper.toPrisma(transfer),
    });

    return transfer;
  }
}
