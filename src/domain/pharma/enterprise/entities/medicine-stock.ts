import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Optional } from '@/core/types/optional'

export interface MedicineStockProps {
  medicineVariantId: UniqueEntityId
  stockId: UniqueEntityId
  currentQuantity: number
  minimumLevel: number
  batchesStockIds: string[]
  lastMove?: Date
  createdAt: Date
  updatedAt?: Date
}

export class MedicineStock extends AggregateRoot<MedicineStockProps> {
  get medicineVariantId(): UniqueEntityId {
    return this.props.medicineVariantId
  }

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

  get minimumLevel() {
    return this.props.minimumLevel
  }

  set minimumLevel(value: number) {
    this.props.minimumLevel = value
    this.touch()
  }

  get batchesStockIds() {
    return this.props.batchesStockIds
  }

  set batchesStockIds(value: string[]) {
    this.props.batchesStockIds = value
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

  public equals(medicineStock: MedicineStock) {
    if (
      medicineStock.medicineVariantId.toString() === this.medicineVariantId.toString() &&
      medicineStock.stockId.toString() === this.stockId.toString()
    ) {
      return true
    }

    return false
  }

  static create(
    props: Optional<MedicineStockProps, 'createdAt' | 'minimumLevel'>,
    id?: UniqueEntityId,
  ) {
    const medicinestock = new MedicineStock({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      minimumLevel: props.minimumLevel ?? 0,
    }, id)

    return medicinestock
  }
}
