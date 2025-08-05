import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TransferRepository } from '@/domain/pharma/application/repositories/transfer-repository';
import { Transfer } from '@/domain/pharma/enterprise/entities/transfer';

export class InMemoryTransferRepository implements TransferRepository {
  public items: Transfer[] = [];

  async create(transfer: Transfer): Promise<void> {
    this.items.push(transfer);
  }

  async findById(id: string): Promise<Transfer | null> {
    const transfer = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );
    if (!transfer) {
      return null;
    }
    return transfer;
  }

  async save(transfer: Transfer): Promise<void> {
    const itemIndex = this.items.findIndex((tranfer) =>
      tranfer.id.equal(transfer.id),
    );
    this.items[itemIndex] = transfer;
  }
}
