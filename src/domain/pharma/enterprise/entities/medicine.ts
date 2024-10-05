import { Entity } from '@/core/entities/entity'
import type { PharmaceuticalForm } from './pharmaceutical-form'
import type { TherapeuticClass } from './therapeutic-class'
import type { Optional } from '@/core/types/optional'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface MedicineProps {
  name: string
  pharmaceuticalForm: PharmaceuticalForm
  therapeuticClasses: TherapeuticClass[]
  dosage: string
  createdAt: Date
  updatedAt?: Date
}

export class Medicine extends Entity<MedicineProps> {
  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  get pharmaceuticalForm(): PharmaceuticalForm {
    return this.props.pharmaceuticalForm
  }

  set pharmaceuticalForm(value: PharmaceuticalForm) {
    this.props.pharmaceuticalForm = value
    this.touch()
  }

  get therapeuticClasses(): TherapeuticClass[] {
    return this.props.therapeuticClasses
  }

  set therapeuticClasses(value: TherapeuticClass[]) {
    this.props.therapeuticClasses = value
    this.touch()
  }

  get dosage(): string {
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

  private touch() {
    this.props.updatedAt = new Date()
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
