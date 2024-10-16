import type { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import type { Optional } from '../../../../core/types/optional'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

export interface StockProps extends AuxiliaryRecordProps {
  status: boolean
}

export class Stock extends AuxiliaryRecord<StockProps> {
  get isActive() {
    return this.props.status
  }

  get status() {
    return this.props.status
  }

  set status(value: boolean) {
    this.props.status = value
    this.touch()
  }

  static create(
    props: Optional<StockProps, 'createdAt' | 'status'>,
    id?: UniqueEntityId,
  ) {
    const stock = new Stock({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      status: true,
    }, id)

    return stock
  }
}
