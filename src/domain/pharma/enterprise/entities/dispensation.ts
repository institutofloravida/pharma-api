import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { MovimentationBatchestock } from './batch-stock'

export interface DispensationProps {
  userId: UniqueEntityId
  dispensationDate: Date
  batchesStocks: MovimentationBatchestock[]
  createdAt: Date
  updatedAt?: Date
}

export class Dispensation extends Entity<DispensationProps> {
  get userId() {
    return this.props.userId
  }

  get dispensationDate() {
    return this.props.dispensationDate
  }

  get batchesStocks() {
    return this.props.batchesStocks
  }

  get totalQuantity() {
    return this.batchesStocks.reduce(
      (acc, dispenseBatchestock) => acc + dispenseBatchestock.quantity,
      0,
    )
  }

  set dispensationDate(value: Date) {
    this.props.dispensationDate = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DispensationProps, 'createdAt' | 'dispensationDate'>,
    id?: UniqueEntityId,
  ) {
    const dispensation = new Dispensation({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      dispensationDate: props.dispensationDate ?? new Date(),
    }, id)

    return dispensation
  }
}
