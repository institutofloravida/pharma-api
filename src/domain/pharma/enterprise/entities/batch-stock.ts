import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { type BatchProps } from './batch'

interface BatchStockProps extends BatchProps {
  stockId: UniqueEntityId
  batchId: UniqueEntityId

  currentQuantity: number
  lastMove?: Date
  createdAt: Date
  updatedAt: Date
}

export class BatchStock extends Entity<BatchStockProps> {
  get stockId(): UniqueEntityId {
    return this.props.stockId
  }

  get quantity(): number {
    return this.props.currentQuantity
  }

  set quantity(value: number) {
    this.props.currentQuantity = value
    this.touch()
  }

  public replenish(value: number) {
    this.props.currentQuantity += value
  }

  public subtract(value: number) {
    if (value > this.quantity) {
      throw new Error(
        'value to be subtract is greater than the current quantity.',
      )
    }
    this.props.currentQuantity -= value
  }

  get lastMove(): Date | undefined {
    return this.props.lastMove
  }

  set lastMove(value: Date | undefined) {
    this.props.lastMove = value
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
    props: BatchStockProps,
    id?: UniqueEntityId,
  ) {
    const batchstock = new BatchStock({
      ...props,
    }, id)

    return batchstock
  }
}
