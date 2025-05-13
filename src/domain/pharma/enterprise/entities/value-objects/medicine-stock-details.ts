import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface MedicineStockDetailsProps {
  id: UniqueEntityId
  stockId: UniqueEntityId
  stock: string
  medicineVariantId: UniqueEntityId
  medicine: string
  pharmaceuticalForm: string;
  unitMeasure: string;
  dosage: string;
  quantity: {
    totalCurrent: number
    available: number
    unavailable: number
  }
  createdAt: Date
  updatedAt?: Date | null
}

export class MedicineStockDetails extends ValueObject<MedicineStockDetailsProps> {
  get id() {
    return this.props.id
  }

  get stockId() {
    return this.props.stockId
  }

  get stock() {
    return this.props.stock
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
    return this.props.quantity
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt ?? null
  }

  static create(props: MedicineStockDetailsProps) {
    return new MedicineStockDetails(props)
  }
}
