import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface MedicineEntryWithMedicineVariantAndBatchProps {
  medicineEntryId: UniqueEntityId
  medicineId: UniqueEntityId;
  medicine: string;
  medicineVariantId: UniqueEntityId;
  dosage: string;
  pharmaceuticalFormId: UniqueEntityId;
  pharmaceuticalForm: string;
  unitMeasureId: UniqueEntityId;
  unitMeasure: string;
  stockId: UniqueEntityId;
  stock: string;
  operatorId: UniqueEntityId;
  operator: string;
  batchId: UniqueEntityId;
  batch: string;
  quantityToEntry: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MedicineEntryWithMedicineVariantAndBatch extends ValueObject<MedicineEntryWithMedicineVariantAndBatchProps> {
  get medicineEntryId() {
    return this.props.medicineEntryId
  }

  get medicineId() {
    return this.props.medicineId
  }

  get medicine() {
    return this.props.medicine
  }

  get medicineVariantId() {
    return this.props.medicineVariantId
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

  get stockId() {
    return this.props.stockId
  }

  get stock() {
    return this.props.stock
  }

  get operatorId() {
    return this.props.operatorId
  }

  get operator() {
    return this.props.operator
  }

  get batchId() {
    return this.props.batchId
  }

  get batch() {
    return this.props.batch
  }

  get quantityToEntry() {
    return this.props.quantityToEntry
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt ?? null
  }

  static create(props: MedicineEntryWithMedicineVariantAndBatchProps) {
    return new MedicineEntryWithMedicineVariantAndBatch(props)
  }
}
