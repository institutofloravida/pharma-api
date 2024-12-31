import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface MedicineVariantWithMedicineProps {
  medicineVariantId: UniqueEntityId
  medicineId: UniqueEntityId;
  medicine: string
  dosage: string;
  pharmaceuticalFormId: UniqueEntityId;
  pharmaceuticalForm: string;
  unitMeasureId: UniqueEntityId
  unitMeasure: string
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MedicineVariantWithMedicine extends ValueObject<MedicineVariantWithMedicineProps> {
  get medicineVariantId() {
    return this.props.medicineVariantId
  }

  get medicineId() {
    return this.props.medicineId
  }

  get medicine() {
    return this.props.medicine
  }

  get dosage() {
    return this.props.dosage
  }

  get pharmaceuticalFormId() {
    return this.props.pharmaceuticalFormId
  }

  get pharmaceuticalForm() {
    return this.props.pharmaceuticalForm
  }

  get unitMeasureId() {
    return this.props.unitMeasureId
  }

  get unitMeasure() {
    return this.props.unitMeasure
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: MedicineVariantWithMedicineProps) {
    return new MedicineVariantWithMedicine(props)
  }
}
