import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MedicineVariantProps {
  medicineId: UniqueEntityId;
  dosage: string;
  pharmaceuticalFormId: UniqueEntityId;
  unitMeasureId: UniqueEntityId
  complement?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MedicineVariant extends AggregateRoot<MedicineVariantProps> {
  get medicineId() {
    return this.props.medicineId
  }

  get dosage() {
    return this.props.dosage
  }

  set dosage(value: string) {
    this.props.dosage = value
    this.touch()
  }

  get pharmaceuticalFormId() {
    return this.props.pharmaceuticalFormId
  }

  set pharmaceuticalFormId(value: UniqueEntityId) {
    this.props.pharmaceuticalFormId = value
    this.touch()
  }

  get unitMeasureId() {
    return this.props.unitMeasureId
  }

  set unitMeasureId(value: UniqueEntityId) {
    this.props.unitMeasureId = value
    this.touch()
  }

  get complement() {
    return this.props.complement
  }

  set complement(value: string | null | undefined) {
    this.props.complement = value ?? null
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

  public equals(medicineVariant: MedicineVariant) {
    if (
      medicineVariant.medicineId.toString() === this.medicineId.toString() &&
      medicineVariant.dosage.toLowerCase().trim().replace(' ', '') === this.dosage.toLowerCase().trim().replace(' ', '') &&
      medicineVariant.pharmaceuticalFormId.toString().toLowerCase().trim() === this.pharmaceuticalFormId.toString().toLowerCase().trim() &&
      medicineVariant.unitMeasureId.toString().toLowerCase().trim() === this.unitMeasureId.toString().toLowerCase().trim()
    ) {
      return true
    }

    return false
  }

  static create(
    props: Optional<MedicineVariantProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new MedicineVariant({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)
  }
}
