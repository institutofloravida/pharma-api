import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface UseMedicineDetailsProps {
  id: UniqueEntityId
  year: number
  month: number
  medicineStockId: UniqueEntityId
  previousBalance: number
  currentBalance: number
  used: number
  medicine: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  complement?: string
  createdAt: Date
  updatedAt?: Date | null
}

export class UseMedicineDetails extends ValueObject<UseMedicineDetailsProps> {
  get id() {
    return this.props.id
  }

  get year() {
    return this.props.year
  }

  get month() {
    return this.props.month
  }

  get medicineStockId() {
    return this.props.medicineStockId
  }

  get previousBalance() {
    return this.props.previousBalance
  }

  get currentBalance() {
    return this.props.currentBalance
  }

  get used() {
    return this.props.used
  }

  get medicine() {
    return this.props.medicine
  }

  get dosage() {
    return this.props.dosage
  }

  get pharmaceuticalForm() {
    return this.props.pharmaceuticalForm
  }

  get unitMeasure() {
    return this.props.unitMeasure
  }

  get complement() {
    return this.props.complement
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: UseMedicineDetailsProps) {
    return new UseMedicineDetails(props)
  }
}
