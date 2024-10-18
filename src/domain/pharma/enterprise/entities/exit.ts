import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export type ExitType = 'DISPENSATION' | 'EXPIRATION' | 'OTHER'

export interface MedicineExitProps {
  medicineStockId: UniqueEntityId
  batchStockId: UniqueEntityId
  quantity: number
  operatorId: string
  exitType: ExitType
  exitDate: Date
  createdAt: Date
  updatedAt?: Date
}

export class MedicineExit extends Entity<MedicineExitProps> {
  get medicineStockId() {
    return this.props.medicineStockId
  }

  get batchStockId() {
    return this.props.batchStockId
  }

  get quantity() {
    return this.props.quantity
  }

  set quantity(value: number) {
    if (value <= 0) {
      throw new Error('Quantity must be greater than zero.')
    }
    this.props.quantity = value
    this.touch()
  }

  get exitType() {
    return this.props.exitType
  }

  set exitType(value: ExitType) {
    this.props.exitType = value
    this.touch()
  }

  get exitDate() {
    return this.props.exitDate
  }

  set exitDate(value: Date) {
    this.props.exitDate = value
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
    props: Optional<MedicineExitProps, 'createdAt' | 'exitDate'>,
    id?: UniqueEntityId,
  ) {
    const medicineExit = new MedicineExit({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      exitDate: props.exitDate ?? new Date(),
    }, id)

    return medicineExit
  }
}
