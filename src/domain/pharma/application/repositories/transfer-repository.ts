import { Meta } from '@/core/repositories/meta';
import {
  Transfer,
  type TransferStatus,
} from '../../enterprise/entities/transfer';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { TransferDetails } from '../../enterprise/entities/value-objects/tranfer-details';
import { TransferWithMovimentation } from '../../enterprise/entities/value-objects/tranfer-with-movimentation';

export abstract class TransferRepository {
  abstract create(transfer: Transfer): Promise<void>;
  abstract findById(id: string): Promise<Transfer | null>;
  abstract save(transfer: Transfer): Promise<void>;
  abstract findByIdWithMovimentation(
    id: string,
  ): Promise<TransferWithMovimentation | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      status?: TransferStatus;
      transferDate?: Date;
    },
  ): Promise<{ transfers: TransferDetails[]; meta: Meta }>;
}
