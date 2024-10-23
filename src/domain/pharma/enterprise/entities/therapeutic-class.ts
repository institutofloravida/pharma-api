import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

interface TherapeuticClassProps extends AuxiliaryRecordProps {}

export class TherapeuticClass extends AuxiliaryRecord<TherapeuticClassProps> {
  static create(
    props: Optional<TherapeuticClassProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const therapeuticClass = new TherapeuticClass({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return therapeuticClass
  }
}
