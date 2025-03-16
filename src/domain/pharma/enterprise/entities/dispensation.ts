import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DispensationProps {
  operatorId: UniqueEntityId
  patientId: UniqueEntityId
  dispensationDate: Date
  createdAt: Date
  updatedAt?: Date | null
}

export class Dispensation extends Entity<DispensationProps> {
  get operatorId() {
    return this.props.operatorId
  }

  get patientId() {
    return this.props.patientId
  }

  get dispensationDate() {
    return this.props.dispensationDate
  }

  set dispensationDate(value: Date) {
    this.props.dispensationDate = value
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
    props: Optional<DispensationProps, 'createdAt' | 'dispensationDate'>,
    id?: UniqueEntityId,
  ) {
    const dispensation = new Dispensation({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      dispensationDate: props.dispensationDate ?? new Date(),
    }, id)

    return dispensation
  }
}
