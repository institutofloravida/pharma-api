import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Optional } from '../../../../core/types/optional'

export interface BatchProps {
  manufacturerId: UniqueEntityId
  code: string
  expirationDate: Date
  manufacturingDate?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Batch extends Entity<BatchProps> {
  get manufacturerId() {
    return this.props.manufacturerId
  }

  get code() {
    return this.props.code
  }

  set code(value) {
    this.props.code = value
    this.touch()
  }

  get expirationDate() {
    return this.props.expirationDate
  }

  set expirationDate(value) {
    this.props.expirationDate = value
    this.touch()
  }

  get manufacturingDate() {
    return this.props.manufacturingDate
  }

  set manufacturingDate(value) {
    this.props.manufacturingDate = value
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

  public isCloseToExpiration(days: number = 30): boolean {
    const expirationDate = this.props.expirationDate
    const currentDate = new Date()
    const timeDiff = expirationDate.getTime() - currentDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff <= days
  }

  public isExpired(): boolean {
    const expirationDate = this.props.expirationDate
    const currentDate = new Date()
    return expirationDate < currentDate
  }

  static create(
    props: Optional<BatchProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const batch = new Batch({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return batch
  }
}
