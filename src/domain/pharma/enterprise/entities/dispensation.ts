import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface DispensationBatch {
  batchStockId: UniqueEntityId
  quantity: number
}

export interface DispensationProps {
  userId: UniqueEntityId
  dispensationDate: Date
  batchsStocks: DispensationBatch[]
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

  get batchsStocks() {
    return this.props.batchsStocks
  }

  get totalQuantity() {
    return this.batchsStocks.reduce(
      (acc, dispenseBatchStock) => acc + dispenseBatchStock.quantity,
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
