import type { TransferDetails } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-details';

export class TransferPresenter {
  static toHTTP(transfer: TransferDetails) {
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
