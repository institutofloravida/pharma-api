import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

export interface TherapeuticClassProps extends AuxiliaryRecordProps {
  description?: string | null
}

export class TherapeuticClass extends AuxiliaryRecord<TherapeuticClassProps> {
  get description() {
    return this.props.description
  }

  set description(description:string | null | undefined) {
    this.props.description = description
    this.touch()
  }

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
