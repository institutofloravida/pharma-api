import { TransferRepository } from '@/domain/pharma/application/repositories/transfer-repository';
import { Transfer } from '@/domain/pharma/enterprise/entities/transfer';
import { PrismaTransferMapper } from '../mappers/prisma-transfer-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
  constructor(private prisma: PrismaService) {}

  async create(transfer: Transfer): Promise<void> {
    const data = PrismaTransferMapper.toPrisma(transfer);
    await this.prisma.transfer.create({ data });
  }

  async findById(id: string): Promise<Transfer | null> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
    });
    return transfer ? PrismaTransferMapper.toDomain(transfer) : null;
  }

  async save(transfer: Transfer): Promise<void> {
    const data = PrismaTransferMapper.toPrisma(transfer);
    await this.prisma.transfer.update({
      where: { id: transfer.id.toString() },
      data,
    });
  }
}
