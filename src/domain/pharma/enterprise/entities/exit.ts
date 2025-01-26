import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type ExitType = 'DISPENSATION' | 'EXPIRATION' | 'OTHER'

export interface MedicineExitProps {
  medicineStockId: UniqueEntityId
  batchestockId: UniqueEntityId
  quantity: number
  operatorId: UniqueEntityId
  exitType: ExitType
  exitDate: Date
  dispensationId?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date
}

export class MedicineExit extends Entity<MedicineExitProps> {
  get medicineStockId() {
    return this.props.medicineStockId
  }

  get batchestockId() {
    return this.props.batchestockId
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

  get operatorId() {
    return this.props.operatorId
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

  get dispensationId() {
    return this.props.dispensationId
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
