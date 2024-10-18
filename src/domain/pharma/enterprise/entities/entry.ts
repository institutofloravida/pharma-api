import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export type EntryType = 'DONATION' | 'TRANSFER' | 'RETURN' | 'GOVERNMENT_SUPPLY' | 'INVENTORY' | 'OTHER'

export interface MedicineEntryProps {
  medicineStockId: UniqueEntityId
  batcheStockId: UniqueEntityId
  quantity: number
  operatorId: string
  entryType: EntryType
  entryDate: Date
  createdAt: Date
  updatedAt?: Date
}

export class MedicineEntry extends Entity<MedicineEntryProps> {
  get medicineStockId() {
    return this.props.medicineStockId
  }

  get batcheStockId() {
    return this.props.batcheStockId
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

  get entryType() {
    return this.props.entryType
  }

  set entryType(value: EntryType) {
    this.props.entryType = value
    this.touch()
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
