import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface EntryDetailsProps {
  entryId: UniqueEntityId
  nfNumber: string
  entryDate: Date
  stock: string;
  operator: string;
  items: number;
}

export class EntryDetails extends ValueObject<EntryDetailsProps> {
  get entryId() {
    return this.props.entryId
  }

  get nfNumber() {
    return this.props.nfNumber
  }

  get entryDate() {
    return this.props.entryDate
  }

  get stock() {
    return this.props.stock
  }

  get operator() {
    return this.props.operator
  }

  get items() {
    return this.props.items
  }

  static create(props: EntryDetailsProps) {
    return new EntryDetails(props)
  }
}
