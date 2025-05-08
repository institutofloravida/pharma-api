import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { ExitType } from '../exit'

export interface MedicineExitDetailsProps {
  medicineExitId: UniqueEntityId
  medicineStockId: UniqueEntityId
  medicine: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  batchestockId: UniqueEntityId
  batch: string
  quantity: number
  stock: string
  operator: string
  exitType: ExitType
  exitDate: Date
  movementType?: string
  createdAt: Date
  updatedAt?: Date | null
}

export class MedicineExitDetails extends ValueObject<MedicineExitDetailsProps> {
  get medicineExitId() {
    return this.props.medicineExitId
  }

  get medicineStockId() {
    return this.props.medicineStockId
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

  get batchestockId() {
    return this.props.batchestockId
  }

  get batch() {
    return this.props.batch
  }

  get quantity() {
    return this.props.quantity
  }

  get stock() {
    return this.props.stock
  }

  get operator() {
    return this.props.operator
  }

  get exitType() {
    return this.props.exitType
  }

  get exitDate() {
    return this.props.exitDate
  }

  get movementType() {
    return this.props.movementType
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt ?? null
  }

  static create(props: MedicineExitDetailsProps) {
    return new MedicineExitDetails(props)
  }
}
