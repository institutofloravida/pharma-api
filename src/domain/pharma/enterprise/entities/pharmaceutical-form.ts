import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { AuxiliaryRecord, AuxiliaryRecordProps } from './auxiliary-records'

export interface PharmaceuticalFormProps extends AuxiliaryRecordProps {}

export class PharmaceuticalForm
  extends AuxiliaryRecord<PharmaceuticalFormProps> {
  static create(
    props: Optional<PharmaceuticalFormProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const pharmaceuticalForm = new PharmaceuticalForm({
      ...props,
      createdAt: props.createdAt ?? new Date(),

    }, id)

    return pharmaceuticalForm
  }
}
