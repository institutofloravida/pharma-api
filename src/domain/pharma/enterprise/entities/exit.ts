import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum ExitType {
  DISPENSATION = 'DISPENSATION',
  MOVEMENT_TYPE = 'MOVEMENT_TYPE',
  EXPIRATION = 'EXPIRATION',
}

export interface MedicineExitProps {
  medicineStockId: UniqueEntityId
  batchestockId: UniqueEntityId
  quantity: number
  operatorId: UniqueEntityId
  exitType: ExitType
  exitDate: Date
  dispensationId?: UniqueEntityId
  movementTypeId?: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class MedicineExit extends Entity<MedicineExitProps> {
  get medicineStockId() {
    return this.props.medicineStockId
  }

  get batchestockId() {
    return this.props.batchestockId
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

  get operatorId() {
    return this.props.operatorId
  }

  get exitType() {
    return this.props.exitType
  }

  set exitType(value: ExitType) {
    this.props.exitType = value
    this.touch()
  }

  get exitDate() {
    return this.props.exitDate
  }

  set exitDate(value: Date) {
    this.props.exitDate = value
    this.touch()
  }

  get dispensationId() {
    return this.props.dispensationId
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
    props: Optional<MedicineExitProps, 'createdAt' | 'exitDate'>,
    id?: UniqueEntityId,
  ) {
    if (props.exitType === 'DISPENSATION') {
      if (!props.dispensationId) {
        throw new Error('dispensationId é obrigatório para saída tipo DISPENSATION')
      }
      if (props.movementTypeId) {
        throw new Error('movementTypeId não deve ser informado para saída tipo DISPENSATION')
      }
    }

    if (props.exitType === 'MOVEMENT_TYPE') {
      if (!props.movementTypeId) {
        throw new Error('movementTypeId é obrigatório para saída tipo MOVEMENT_TYPE')
      }
      if (props.dispensationId) {
        throw new Error('dispensationId não deve ser informado para saída tipo MOVEMENT_TYPE')
      }
    }

    const medicineExit = new MedicineExit(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        exitDate: props.exitDate ?? new Date(),
      },
      id,
    )

    return medicineExit
  }
}
