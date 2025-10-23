import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { ExitType } from '../exit';

export interface ExitWithStockProps {
  exitId: UniqueEntityId;
  exitDate: Date;
  exitType: ExitType;
  stock: string;
  stockId: UniqueEntityId;
  destinationInstitution?: string;
  responsibleByInstitution?: string;
  reverseAt?: Date | null;
  operator: string;
  items: number;
}

export class ExitWithStock extends ValueObject<ExitWithStockProps> {
  get exitId() {
    return this.props.exitId;
  }

  get exitDate() {
    return this.props.exitDate;
  }

  get exitType() {
    return this.props.exitType;
  }

  get stock() {
    return this.props.stock;
  }

  get stockId() {
    return this.props.stockId;
  }

  get operator() {
    return this.props.operator;
  }

  get destinationInstitution() {
    return this.props.destinationInstitution;
  }

  get responsibleByInstitution() {
    return this.props.responsibleByInstitution;
  }

  get reverseAt() {
    return this.props.reverseAt;
  }

  get items() {
    return this.props.items;
  }

  static create(props: ExitWithStockProps) {
    return new ExitWithStock(props);
  }
}
