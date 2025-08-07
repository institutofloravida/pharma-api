import type { TransferWithMovimentation } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-with-movimentation';

export class TransferWithMovimentationPresenter {
  static toHTTP(transfer: TransferWithMovimentation) {
    return {
      transferId: transfer.transferId.toString(),
      institutionOrigin: transfer.institutionOrigin,
      institutionDestination: transfer.institutionDestination,
      stockOrigin: transfer.stockOrigin,
      stockDestination: transfer.stockDestination,
      status: transfer.status,
      operator: transfer.operator,
      confirmedAt: transfer.confirmedAt,
      batches: transfer.batches,
      transferDate: transfer.transferDate,
    };
  }
}
