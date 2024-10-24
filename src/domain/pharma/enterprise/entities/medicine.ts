import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface MedicineProps {
  content: string
  description?: string | null
  dosage: string
  pharmaceuticalFormId: UniqueEntityId
  therapeuticClassesIds: UniqueEntityId[]
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

  get pharmaceuticalForm() {
    return this.props.pharmaceuticalFormId
  }

  set pharmaceuticalForm(value: UniqueEntityId) {
    this.props.pharmaceuticalFormId = value
    this.touch()
  }

  get therapeuticClasses() {
    return this.props.therapeuticClassesIds
  }

  set therapeuticClasses(value: UniqueEntityId[]) {
    this.props.therapeuticClassesIds = value
    this.touch()
  }

  get dosage() {
    return this.props.dosage
  }

  set dosage(value: string) {
    this.props.dosage = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  public equals(medicine: Medicine) {
    if (
      medicine.content.toLowerCase().trim() === this.content.toLowerCase().trim() &&
      medicine.dosage.toLowerCase().trim().replace(' ', '') === this.dosage.toLowerCase().trim().replace(' ', '') &&
      medicine.pharmaceuticalForm.toString().toLowerCase().trim() === this.pharmaceuticalForm.toString().toLowerCase().trim()
    ) {
      return true
    }

    return false
  }

  static create(
    props: Optional<MedicineProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const medicine = new Medicine({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return medicine
  }
}
