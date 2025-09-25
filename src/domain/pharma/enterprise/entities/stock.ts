import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Optional } from '../../../../core/types/optional';
import {
  AuxiliaryRecord,
  type AuxiliaryRecordProps,
} from './auxiliary-records';

export interface StockProps extends AuxiliaryRecordProps {
  status: boolean;
  institutionId: UniqueEntityId;
}

export class Stock extends AuxiliaryRecord<StockProps> {
  get isActive() {
    return this.props.status;
  }

  get status() {
    return this.props.status;
  }

  set status(value: boolean) {
    this.props.status = value;
    this.touch();
  }

  get institutionId() {
    return this.props.institutionId;
  }

  set institutionId(value: UniqueEntityId) {
    this.props.institutionId = value;
    this.touch();
  }

  public activate() {
    this.props.status = true;
    this.touch();
  }

  public deactivate() {
    this.props.status = false;
    this.touch();
  }

  static create(
    props: Optional<StockProps, 'createdAt' | 'status'>,
    id?: UniqueEntityId,
  ) {
    const stock = new Stock(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? true,
      },
      id,
    );

    return stock;
  }
}
