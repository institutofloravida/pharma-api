import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StockSettingsProps {
  stockId: UniqueEntityId
  expirationWarningDays: number
  createdAt: Date
  updatedAt?: Date | null
}

export class StockSettings extends Entity<StockSettingsProps> {
  get stockId() {
    return this.props.stockId
  }

  get expirationWarningDays() {
    return this.props.expirationWarningDays
  }

  set expirationWarningDays(value: number) {
    this.props.expirationWarningDays = value
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
    props: Optional<StockSettingsProps, 'createdAt' | 'expirationWarningDays'>,
    id?: UniqueEntityId,
  ): StockSettings {
    return new StockSettings(
      {
        ...props,
        expirationWarningDays: props.expirationWarningDays ?? 30,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
