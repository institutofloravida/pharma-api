import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

interface UnitMeasureProps extends AuxiliaryRecordProps {
  acronym: string
}

export class UnitMeasure extends AuxiliaryRecord<UnitMeasureProps> {
  get acronym() {
    return this.props.acronym
  }

  set acronym(value: string) {
    this.props.acronym = value
    this.touch()
  }

  static create(
    props: Optional<UnitMeasureProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const unitMeasure = new UnitMeasure({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return unitMeasure
  }
}
