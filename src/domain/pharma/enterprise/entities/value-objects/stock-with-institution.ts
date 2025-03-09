import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface StockWithInstitutionProps {
  id: UniqueEntityId
  content: string;
  status: boolean;
  institutionId: UniqueEntityId
  institutionName: string
  createdAt: Date;
  updatedAt?: Date | null;
}

export class StockWithInstitution extends ValueObject<StockWithInstitutionProps> {
  get id() {
    return this.props.id
  }

  get content() {
    return this.props.content
  }

  get status() {
    return this.props.status
  }

  get institutionId() {
    return this.props.institutionId
  }

  get institutionName() {
    return this.props.institutionName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: StockWithInstitutionProps) {
    return new StockWithInstitution(props)
  }
}
