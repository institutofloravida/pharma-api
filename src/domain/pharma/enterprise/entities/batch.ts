import type { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import type { Optional } from '../../../../core/types/optional'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

interface BatchProps extends AuxiliaryRecordProps {
  medicineId: UniqueEntityId
  stockId: UniqueEntityId
  expirationDate: Date
  manufacturerId: UniqueEntityId
  manufacturingDate?: Date
  quantity: number
}

export class Batch extends AuxiliaryRecord<BatchProps> {
  get expirationDate() {
    return this.props.expirationDate
  }

  set expirationDate(value) {
    this.props.expirationDate = value
    this.touch()
  }

  get manufacturerId() {
    return this.props.manufacturerId
  }

  get manufacturingDate() {
    return this.props.manufacturingDate
  }

  set manufacturingDate(value) {
    this.props.manufacturingDate = value
    this.touch()
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
