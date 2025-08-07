import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';
import { TransferWithMovimentation } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-with-movimentation';
import {
  Transfer as PrismaTransfer,
  Exit as PrismaExit,
} from 'prisma/generated';

export class PrismaTransferWithMovimentationMapper {
  static toDomain(
    raw: PrismaTransfer &
      PrismaExit & {
        operator: string;
        stock: string;
        institutionOrigin: string;
        institutionDestination: string;
        stockDestination: string;
        stockOrigin: string;
        batches: {
          medicine: string;
          pharmaceuticalForm: string;
          unitMeasure: string;
          dosage: string;
          complement?: string;
          batchId: UniqueEntityId;
          code: string;
          manufacturer: string;
          expirationDate: Date;
          quantity: number;
        }[];
      },
  ): TransferWithMovimentation {
    return TransferWithMovimentation.create({
      transferId: new UniqueEntityId(raw.id),
      transferDate: raw.exitDate,
      operator: raw.operator,
      status: TransferStatus[raw.status],
      institutionOrigin: raw.institutionOrigin,
      institutionDestination: raw.institutionDestination,
      stockOrigin: raw.stockOrigin,
      stockDestination: raw.stockDestination,
      batches: raw.batches,
      confirmedAt: raw.confirmedAt,
    });
  }
}
