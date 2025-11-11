import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { TransferStatus } from '../transfer';

export interface TransferWithMovimentationProps {
  transferId: UniqueEntityId;
  status: TransferStatus;
  transferDate: Date;
  confirmedAt?: Date | null;
  institutionOrigin: string;
  stockOrigin: string;
  institutionDestination?: string;
  stockDestination: string;
  operator: string;
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
}

export class TransferWithMovimentation extends ValueObject<TransferWithMovimentationProps> {
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

  get institutionDestination() {
    return this.props.institutionDestination;
  }

  get operator() {
    return this.props.operator;
  }

  get batches() {
    return this.props.batches;
  }

  static create(props: TransferWithMovimentationProps) {
    return new TransferWithMovimentation(props);
  }
}
