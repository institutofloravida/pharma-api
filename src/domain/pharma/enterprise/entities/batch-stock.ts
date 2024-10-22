import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MovimentationBatchStock {
  batchStockId: UniqueEntityId
  quantity: number
}

export interface BatchStockProps {
  stockId: UniqueEntityId
  batchId: UniqueEntityId

  medicineId: UniqueEntityId

  currentQuantity: number
  lastMove?: Date
  createdAt: Date
  updatedAt?: Date
}

export class BatchStock extends Entity<BatchStockProps> {
  get stockId(): UniqueEntityId {
    return this.props.stockId
  }

  get batchId(): UniqueEntityId {
    return this.props.batchId
  }

  get medicineId(): UniqueEntityId {
    return this.props.medicineId
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
    props: Optional< BatchStockProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const batchstock = new BatchStock({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return batchstock
  }
}
