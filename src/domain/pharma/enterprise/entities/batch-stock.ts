import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MovimentationBatchestock {
  batcheStockId: UniqueEntityId
  quantity: number
}

export interface BatcheStockProps {
  stockId: UniqueEntityId
  batchId: UniqueEntityId
  medicineVariantId: UniqueEntityId
  currentQuantity: number
  medicineStockId: UniqueEntityId
  lastMove?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class BatchStock extends Entity<BatcheStockProps> {
  get stockId(): UniqueEntityId {
    return this.props.stockId
  }

  get batchId(): UniqueEntityId {
    return this.props.batchId
  }

  get medicineVariantId(): UniqueEntityId {
    return this.props.medicineVariantId
  }

  get quantity(): number {
    return this.props.currentQuantity
  }

  set quantity(value: number) {
    this.props.currentQuantity = value
    this.touch()
  }

  get medicineStockId() {
    return this.props.medicineStockId
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

  get lastMove(): Date | null | undefined {
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
    props: Optional< BatcheStockProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const batchestock = new BatchStock({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return batchestock
  }
}
