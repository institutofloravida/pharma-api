import type { Optional } from '@/core/types/optional'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

export interface PathologyProps extends AuxiliaryRecordProps {}

export class Pathology extends AuxiliaryRecord<PathologyProps> {
  static create(
    props: Optional<PathologyProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const pathology = new Pathology(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return pathology
  }
}
