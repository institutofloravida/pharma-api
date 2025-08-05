import { Transfer } from '../../enterprise/entities/transfer';

export abstract class TransferRepository {
  abstract create(transfer: Transfer): Promise<void>;
  abstract findById(id: string): Promise<Transfer | null>;
  abstract save(transfer: Transfer): Promise<void>;
}
