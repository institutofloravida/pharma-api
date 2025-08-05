/* eslint-disable no-unused-vars */
import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export enum ExitType {
  DISPENSATION = 'DISPENSATION',
  MOVEMENT_TYPE = 'MOVEMENT_TYPE',
  EXPIRATION = 'EXPIRATION',
  DONATION = 'DONATION',
  TRANSFER = 'TRANSFER',
}

export interface MedicineExitProps {
  exitType: ExitType;
  exitDate: Date;
  stockId: UniqueEntityId;
  operatorId: UniqueEntityId;
  dispensationId?: UniqueEntityId;
  transferId?: UniqueEntityId;
  movementTypeId?: UniqueEntityId;
  destinationInstitutionId?: UniqueEntityId | null;
  createdAt: Date;
  updatedAt?: Date;
}

export class MedicineExit extends Entity<MedicineExitProps> {
  get exitType() {
    return this.props.exitType;
  }

  set exitType(value: ExitType) {
    this.props.exitType = value;
    this.touch();
  }

  get exitDate() {
    return this.props.exitDate;
  }

  set exitDate(value: Date) {
    this.props.exitDate = value;
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

  set transferId(value: UniqueEntityId | undefined) {
    this.props.transferId = value;
    this.touch();
  }

  get dispensationId() {
    return this.props.dispensationId;
  }

  get operatorId() {
    return this.props.operatorId;
  }

  set operatorId(value: UniqueEntityId) {
    this.props.operatorId = value;
    this.touch();
  }

  get destinationInstitutionId() {
    return this.props.destinationInstitutionId;
  }

  set destinationInstitutionId(value: UniqueEntityId | null | undefined) {
    this.props.destinationInstitutionId = value;
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
    props: Optional<MedicineExitProps, 'createdAt' | 'exitDate'>,
    id?: UniqueEntityId,
  ) {
    const medicineExit = new MedicineExit(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        exitDate: props.exitDate ?? new Date(),
      },
      id,
    );

    return medicineExit;
  }
}
