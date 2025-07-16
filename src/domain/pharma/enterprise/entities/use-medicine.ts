import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UseMedicineProps {
  year: number
  month: number
  medicineStockId: UniqueEntityId
  previousBalance: number
  currentBalance: number
  used: number
  createdAt: Date
  updatedAt?: Date | null
}

export class UseMedicine extends Entity<UseMedicineProps> {
  get year() {
    return this.props.year
  }

  set year(year: number) {
    this.props.year = year
    this.touch()
  }

  get month() {
    return this.props.month
  }

  set month(month: number) {
    this.props.month = month
    this.touch()
  }

  get medicineStockId() {
    return this.props.medicineStockId
  }

  set medicineStockId(medicineStockId: UniqueEntityId) {
    this.props.medicineStockId = medicineStockId
    this.touch()
  }

  get previousBalance() {
    return this.props.previousBalance
  }

  set previousBalance(previousBalance: number) {
    this.props.previousBalance = previousBalance
    this.touch()
  }

  get currentBalance() {
    return this.props.currentBalance
  }

  set currentBalance(currentBalance: number) {
    this.props.currentBalance = currentBalance
    this.touch()
  }

  get used() {
    return this.props.used
  }

  set used(used: number) {
    this.props.used = used
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
    props: Optional<UseMedicineProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const usemedicine = new UseMedicine({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return usemedicine
  }
}
