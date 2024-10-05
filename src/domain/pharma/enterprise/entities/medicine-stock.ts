import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '../../../../core/entities/unique-entity-id'

interface MedicineStockProps {
  medicineId: UniqueEntityId
  stockId: UniqueEntityId
  quantity: number
  minimumLevel?: number
  lastMove?: Date
  createdAt: Date
  updatedAt: Date
}

export class MedicineStock extends Entity<MedicineStockProps> {
  get medicineId(): UniqueEntityId {
    return this.props.medicineId
  }

  get stockId(): UniqueEntityId {
    return this.props.stockId
  }

  get quantity(): number {
    return this.props.quantity
  }

  set quantity(value: number) {
    this.props.quantity = value
    this.touch()
  }

  public replenish(value: number) {
    this.props.quantity += value
  }

  public subtract(value: number) {
    if (value > this.quantity) {
      throw new Error(
        'value to be subtract is greater than the current quantity.',
      )
    }
    this.props.quantity -= value
  }

  get minimumLevel(): number | undefined {
    return this.props.minimumLevel
  }

  set minimumLevel(value: number | undefined) {
    this.props.minimumLevel = value
    this.touch()
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
    props: MedicineStockProps,
    id?: UniqueEntityId,
  ) {
    const medicinestock = new MedicineStock({
      ...props,
    }, id)

    return medicinestock
  }
}
