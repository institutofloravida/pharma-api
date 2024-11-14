import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface MedicineProps {
  content: string
  description?: string | null
  therapeuticClassesIds: UniqueEntityId[]
  medicinesVariantsIds: UniqueEntityId[]
  createdAt: Date
  updatedAt?: Date | null

}

export class Medicine extends AggregateRoot<MedicineProps> {
  get content() {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get description(): string | null | undefined {
    return this.props.description
  }

  set description(value: string) {
    this.props.description = value
    this.touch()
  }

  get therapeuticClasses() {
    return this.props.therapeuticClassesIds
  }

  set therapeuticClasses(value: UniqueEntityId[]) {
    this.props.therapeuticClassesIds = value
    this.touch()
  }

  get medicinesVariantsIds() {
    return this.props.medicinesVariantsIds
  }

  set medicinesVariantsIds(value: UniqueEntityId[]) {
    this.props.medicinesVariantsIds = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public equals(medicine: Medicine) {
    if (
      medicine.content.toString().toLocaleLowerCase().trim() === this.content.toString().toLocaleLowerCase().trim()
    ) {
      return true
    }

    return false
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<MedicineProps, 'createdAt' | 'medicinesVariantsIds'>,
    id?: UniqueEntityId,
  ) {
    const medicine = new Medicine({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      medicinesVariantsIds: props.medicinesVariantsIds ?? [],
    }, id)

    return medicine
  }
}
