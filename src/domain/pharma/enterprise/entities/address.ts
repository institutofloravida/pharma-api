import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AddressProps {
  street?: string | null
  number?: string | null
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Address extends Entity<AddressProps> {
  get street(): string | null {
    return this.props.street
      ? this.props.street
      : null
  }

  set street(value: string) {
    this.props.street = value
    this.touch()
  }

  get number():string | null {
    return this.props.number
      ? this.props.number
      : null
  }

  set number(value: string) {
    this.props.number = value
    this.touch()
  }

  get complement() {
    return this.props.complement ?? null
  }

  set complement(value: string | null) {
    this.props.complement = value
    this.touch()
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(value: string) {
    this.props.neighborhood = value
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(value: string) {
    this.props.city = value
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(value: string) {
    this.props.state = value
    this.touch()
  }

  get zipCode(): string | null {
    return this.props.zipCode
      ? this.props.zipCode
      : null
  }

  set zipCode(value: string) {
    this.props.zipCode = value
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
    props: Optional<AddressProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const address = new Address({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return address
  }
}
