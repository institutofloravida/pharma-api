import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export type OperatorRole = 'COMMON' | 'MANAGER' | 'SUPER_ADMIN'

export interface OperatorProps {
  name: string
  email: string
  passwordHash: string
  institutionsIds: UniqueEntityId[]
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

  get institutionsIds() {
    return this.props.institutionsIds
  }

  set institutionsIds(value) {
    this.props.institutionsIds = value
    this.touch()
  }

  get role() {
    return this.props.role
  }

  set role(role: OperatorRole) {
    this.props.role = role
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

  public isSuperAdmin() {
    return this.role === 'SUPER_ADMIN'
  }

  public isManager() {
    return this.role === 'MANAGER'
  }

  public isCommon() {
    return this.role === 'COMMON'
  }

  public canManageInstitution(institutionId: UniqueEntityId): boolean {
    return this.role === 'SUPER_ADMIN' ||
           (this.role === 'MANAGER' && this.institutionsIds.includes(institutionId))
  }

  public canManageOperators(): boolean {
    return this.role === 'SUPER_ADMIN' || this.role === 'MANAGER'
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OperatorProps, 'createdAt' | 'role' | 'institutionsIds'>,
    id?: UniqueEntityId,
  ) {
    const operator = new Operator({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      role: props.role ?? 'COMMON',
      institutionsIds: props.institutionsIds ?? [],
    }, id)

    return operator
  }
}
