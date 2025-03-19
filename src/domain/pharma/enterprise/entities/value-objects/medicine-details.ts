import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface MedicineDetailsProps {
  id: UniqueEntityId
  content: string
  description?: string | null
  therapeuticClasses: {
    id: UniqueEntityId
    name: string
  }[],
  createdAt: Date
  updatedAt?: Date | null
}

export class MedicineDetails extends ValueObject<MedicineDetailsProps> {
  get id() {
    return this.props.id
  }

  get content() {
    return this.props.content
  }

  get description(): string | null | undefined {
    return this.props.description
  }

  get therapeuticClasses() {
    return this.props.therapeuticClasses
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: MedicineDetailsProps) {
    return new MedicineDetails(props)
  }
}
