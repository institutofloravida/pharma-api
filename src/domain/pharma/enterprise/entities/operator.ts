import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export type OperatorRole = 'ADMIN' | 'COMMON'

export interface OperatorProps {
  name: string
  email: string
  passwordHash: string
  institutionsIds?: UniqueEntityId[]
  role: OperatorRole
  createdAt: Date
  updatedAt?: Date | null
}

export class Operator extends Entity<OperatorProps> {
  get name() {
    return this.props.name
  }

  set name(value) {
    this.props.name = value
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(value) {
    this.props.email = value
    this.touch()
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  set passwordHash(value) {
    this.props.passwordHash = value
    this.touch()
  }

  get role() {
    return this.props.role
  }

  public assignRole(value: OperatorRole) {
    this.props.role = value
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
    props: Optional<OperatorProps, 'createdAt' | 'role'>,
    id?: UniqueEntityId,
  ) {
    const operator = new Operator({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      role: 'COMMON',
    }, id)

    return operator
  }
}
