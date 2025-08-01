import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import type { ExitType } from '../exit'

export interface ExitDetailsProps {
  exitId: UniqueEntityId
  exitDate: Date
  exitType: ExitType,
  stock: string;
  destinationInstitution?: string;
  responsibleByInstitution?: string;
  operator: string;
  items: number;
}

export class ExitDetails extends ValueObject<ExitDetailsProps> {
  get exitId() {
    return this.props.exitId
  }

  get exitDate() {
    return this.props.exitDate
  }

  get exitType() {
    return this.props.exitType
  }

  get stock() {
    return this.props.stock
  }

  get operator() {
    return this.props.operator
  }

  get destinationInstitution() {
    return this.props.destinationInstitution
  }

  get responsibleByInstitution() {
    return this.props.responsibleByInstitution
  }

  get items() {
    return this.props.items
  }

  static create(props: ExitDetailsProps) {
    return new ExitDetails(props)
  }
}
