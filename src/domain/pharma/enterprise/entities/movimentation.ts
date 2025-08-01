import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { MovementDirection } from './movement-type'

export interface MovimentationProps {
  direction: MovementDirection
  batchStockId: UniqueEntityId
  quantity: number
  movementTypeId?: UniqueEntityId
  dispensationId?: UniqueEntityId
  exitId?: UniqueEntityId
  entryId?: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class Movimentation extends Entity<MovimentationProps> {
  get direction() {
    return this.props.direction
  }

  get batchestockId() {
    return this.props.batchStockId
  }

  get quantity() {
    return this.props.quantity
  }

  set quantity(value: number) {
    if (value <= 0) {
      throw new Error('Quantity must be greater than zero.')
    }
    this.props.quantity = value
    this.touch()
  }

  get dispensationId() {
    return this.props.dispensationId
  }

  get exitId() {
    return this.props.exitId
  }

  get entryId() {
    return this.props.entryId
  }

  get movementTypeId() {
    return this.props.movementTypeId
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
    props: Optional<MovimentationProps, 'createdAt' >,
    id?: UniqueEntityId,
  ) {
    if (!props.exitId && !props.entryId) {
      throw new Error('exitId or entryId is required')
    }

    if (props.direction === 'EXIT' && !props.exitId) {
      throw new Error('exitId is required for EXIT direction')
    }
    if (props.direction === 'ENTRY' && !props.entryId) {
      throw new Error('entryId is required for ENTRY direction')
    }

    if (props.dispensationId) {
      if (props.movementTypeId) {
        throw new Error('movementTypeId não deve ser informado para saída tipo DISPENSATION')
      }
    }

    if (props.movementTypeId) {
      if (props.dispensationId) {
        throw new Error('dispensationId não deve ser informado para saída tipo MOVEMENT_TYPE')
      }
    }

    const movimentation = new Movimentation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return movimentation
  }
}
