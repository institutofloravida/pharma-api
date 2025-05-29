import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MedicineEntryProps {
  medicineStockId: UniqueEntityId
  batcheStockId: UniqueEntityId
  nfNumber: string
  quantity: number
  operatorId: UniqueEntityId
  movementTypeId: UniqueEntityId
  entryDate: Date
  createdAt: Date
  updatedAt?: Date | null
}

export class MedicineEntry extends Entity<MedicineEntryProps> {
  get medicineStockId() {
    return this.props.medicineStockId
  }

  get batcheStockId() {
    return this.props.batcheStockId
  }

  get nfNumber() {
    return this.props.nfNumber
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

  get movementTypeId() {
    return this.props.movementTypeId
  }

  get entryDate() {
    return this.props.entryDate
  }

  set entryDate(value: Date) {
    this.props.entryDate = value
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
    props: Optional<MedicineEntryProps, 'createdAt' | 'entryDate'>,
    id?: UniqueEntityId,
  ) {
    const medicineEntry = new MedicineEntry({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      entryDate: props.entryDate ?? new Date(),
    }, id)

    return medicineEntry
  }
}
