import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface BatchStockWithBatchProps {
  id: UniqueEntityId
  stockId: UniqueEntityId
  stock: string
  batchId: UniqueEntityId
  batch: string
  medicineStockId: UniqueEntityId
  medicineVariantId: UniqueEntityId
  medicine: string
  pharmaceuticalForm: string;
  unitMeasure: string;
  dosage: string;
  currentQuantity: number
  expirationDate: Date
  isCloseToExpiration: boolean
  isExpired: boolean
  isAvailable: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class BatchStockWithBatch extends ValueObject<BatchStockWithBatchProps> {
  get id() {
    return this.props.id
  }

  get stockId() {
    return this.props.stockId
  }

  get stock() {
    return this.props.stock
  }

  get batchId() {
    return this.props.batchId
  }

  get batch() {
    return this.props.batch
  }

  get medicineStockId() {
    return this.props.medicineStockId
  }

  get medicineVariantId() {
    return this.props.medicineVariantId
  }

  get medicine() {
    return this.props.medicine
  }

  get pharmaceuticalForm() {
    return this.props.pharmaceuticalForm
  }

  get unitMeasure() {
    return this.props.unitMeasure
  }

  get dosage() {
    return this.props.dosage
  }

  get quantity() {
    return this.props.currentQuantity
  }

  get expirationDate() {
    return this.props.expirationDate
  }

  get isCloseToExpiration() {
    return this.props.isCloseToExpiration
  }

  get isExpired() {
    return this.props.isExpired
  }

  get isAvailable() {
    return this.props.isAvailable
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt ?? null
  }

  static create(props: BatchStockWithBatchProps) {
    return new BatchStockWithBatch(props)
  }
}
