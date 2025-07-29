import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface ExitDetailsProps {
  exitId: UniqueEntityId
  exitDate: Date
  stock: string;
  operator: string;
  items: number;
}

export class ExitDetails extends ValueObject<ExitDetailsProps> {
  get exitId() {
    return this.props.exitId
  }

  get exitDate() {
    return this.props.exitDate
  }

  get stock() {
    return this.props.stock
  }

  get operator() {
    return this.props.operator
  }

  get items() {
    return this.props.items
  }

  static create(props: ExitDetailsProps) {
    return new ExitDetails(props)
  }
}
