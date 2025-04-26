import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface DispensationDetailsProps {
  dispensationId: UniqueEntityId
  medicine: {
    name: string
    pharmaceuticaForm: string
    unitMeasure: string
    dosage: string
    quantity: number
  }
  operatorId: UniqueEntityId
  operator: string
  patientId: UniqueEntityId
  patient: string
  dispensationDate: Date
}

export class DispensationDetails extends ValueObject<DispensationDetailsProps> {
  get dispensationId() {
    return this.props.dispensationId
  }

  get medicine() {
    return this.props.medicine
  }

  get operatorId() {
    return this.props.operatorId
  }

  get operator() {
    return this.props.operator
  }

  get patientId() {
    return this.props.patientId
  }

  get patient() {
    return this.props.patient
  }

  get dispensationDate() {
    return this.props.dispensationDate
  }

  static create(props: DispensationDetailsProps) {
    return new DispensationDetails(props)
  }
}
