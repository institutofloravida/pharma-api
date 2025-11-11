import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { TransferStatus } from '../transfer';

export interface TransferDetailsProps {
  transferId: UniqueEntityId;
  status: TransferStatus;
  transferDate: Date;
  confirmedAt?: Date | null;
  institutionOrigin: string;
  institutionOriginId: string;
  stockOrigin: string;
  institutionDestination?: string;
  institutionDestinationId?: string;
  stockDestination: string;
  operator: string;
  batches: number;
}

export class TransferDetails extends ValueObject<TransferDetailsProps> {
  get transferId() {
    return this.props.transferId;
  }

  get status() {
    return this.props.status;
  }

  get transferDate() {
    return this.props.transferDate;
  }

  get confirmedAt() {
    return this.props.confirmedAt;
  }

  get stockOrigin() {
    return this.props.stockOrigin;
  }

  get stockDestination() {
    return this.props.stockDestination;
  }

  get institutionOrigin() {
    return this.props.institutionOrigin;
  }

  get institutionOriginId() {
    return this.props.institutionOriginId;
  }

  get institutionDestination() {
    return this.props.institutionDestination;
  }

  get institutionDestinationId() {
    return this.props.institutionDestinationId;
  }

  get operator() {
    return this.props.operator;
  }

  get batches() {
    return this.props.batches;
  }

  static create(props: TransferDetailsProps) {
    return new TransferDetails(props);
  }
}
