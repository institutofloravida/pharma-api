/* eslint-disable no-unused-vars */
import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export enum TransferStatus {
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
}

export interface TransferProps {
  status: TransferStatus;
  stockDestinationId: UniqueEntityId;
  confirmedAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Transfer extends Entity<TransferProps> {
  get status() {
    return this.props.status;
  }

  set status(value: TransferStatus) {
    this.props.status = value;
    this.touch();
  }

  get stockDestinationId() {
    return this.props.stockDestinationId;
  }

  set stockDestinationId(value: UniqueEntityId) {
    this.props.stockDestinationId = value;
    this.touch();
  }

  get confirmedAt() {
    return this.props.confirmedAt;
  }

  set confirmedAt(value: Date | null | undefined) {
    this.props.confirmedAt = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<TransferProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const transfer = new Transfer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return transfer;
  }
}
