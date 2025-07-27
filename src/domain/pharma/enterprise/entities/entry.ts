import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MedicineEntryProps {
  nfNumber: string
  entryDate: Date
  stockId: UniqueEntityId
  operatorId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class MedicineEntry extends Entity<MedicineEntryProps> {
  get nfNumber() {
    return this.props.nfNumber
  }

  get entryDate() {
    return this.props.entryDate
  }

  set entryDate(value: Date) {
    this.props.entryDate = value
    this.touch()
  }

  get operatorId() {
    return this.props.operatorId
  }

  set operatorId(value: UniqueEntityId) {
    this.props.operatorId = value
    this.touch()
  }

  get stockId() {
    return this.props.stockId
  }

  set stockId(value: UniqueEntityId) {
    this.props.stockId = value
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
