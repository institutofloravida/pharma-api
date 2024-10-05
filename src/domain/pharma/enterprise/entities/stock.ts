import type { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import type { Optional } from '../../../../core/types/optional'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

interface StockProps extends AuxiliaryRecordProps {
  status: boolean
}

export class Stock extends AuxiliaryRecord<StockProps> {
  get isActive(): boolean {
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
    props: Optional<StockProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const stock = new Stock({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return stock
  }
}
