/* eslint-disable no-unused-vars */
import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export enum EntryType {
  MOVEMENT_TYPE = 'MOVEMENT_TYPE',
  TRANSFER = 'TRANSFER',
}

export interface MedicineEntryProps {
  entryType: EntryType;
  nfNumber?: string;
  entryDate: Date;
  stockId: UniqueEntityId;
  movementTypeId?: UniqueEntityId;
  transferId?: UniqueEntityId | null;
  operatorId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MedicineEntry extends Entity<MedicineEntryProps> {
  get entryType() {
    return this.props.entryType;
  }

  set entryType(value: EntryType) {
    this.props.entryType = value;
    this.touch();
  }

  get nfNumber() {
    return this.props.nfNumber;
  }

  get entryDate() {
    return this.props.entryDate;
  }

  set entryDate(value: Date) {
    this.props.entryDate = value;
    this.touch();
  }

  get operatorId() {
    return this.props.operatorId;
  }

  set operatorId(value: UniqueEntityId) {
    this.props.operatorId = value;
    this.touch();
  }

  get stockId() {
    return this.props.stockId;
  }

  set stockId(value: UniqueEntityId) {
    this.props.stockId = value;
    this.touch();
  }

  get movementTypeId() {
    return this.props.movementTypeId;
  }

  set movementTypeId(value: UniqueEntityId | undefined) {
    this.props.movementTypeId = value;
    this.touch();
  }

  get transferId() {
    return this.props.transferId;
  }

  set transferId(value: UniqueEntityId | undefined | null) {
    this.props.transferId = value;
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
    props: Optional<MedicineEntryProps, 'createdAt' | 'entryDate'>,
    id?: UniqueEntityId,
  ) {
    if (
      (props.entryType === EntryType.TRANSFER && !props.transferId) ||
      (props.transferId && props.entryType === EntryType.MOVEMENT_TYPE)
    ) {
      throw new Error('Invalid entry type');
    }
    const medicineEntry = new MedicineEntry(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        entryDate: props.entryDate ?? new Date(),
      },
      id,
    );

    return medicineEntry;
  }
}
