import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { EntryType } from '../entry';

export interface EntryDetailsBatchProps {
  movimentationId: string;
  batchNumber: string;
  manufacturer: string;
  manufacturingDate?: Date;
  expirationDate: Date;
  quantity: number; // quantidade efetiva (após correções)
  originalQuantity?: number; // quantidade original (preenchida quando houve correção)
}

export interface EntryDetailsMedicineProps {
  medicineStockId: string;
  medicineName: string;
  dosage: string;
  pharmaceuticalForm: string;
  unitMeasure: string;
  complement?: string;
  batches: EntryDetailsBatchProps[];
}

export interface EntryDetailsProps {
  entryId: UniqueEntityId;
  nfNumber?: string;
  entryDate: Date;
  stock: string;
  operator: string;
  entryType: EntryType;
  movementType?: string;
  correctedAt?: Date | null;
  correctionOfEntryId?: string | null;
  medicines: EntryDetailsMedicineProps[];
}

export class EntryDetails extends ValueObject<EntryDetailsProps> {
  get entryId() {
    return this.props.entryId;
  }

  get nfNumber() {
    return this.props.nfNumber;
  }

  get entryDate() {
    return this.props.entryDate;
  }

  get stock() {
    return this.props.stock;
  }

  get operator() {
    return this.props.operator;
  }

  get entryType() {
    return this.props.entryType;
  }

  get movementType() {
    return this.props.movementType;
  }

  get correctedAt() {
    return this.props.correctedAt;
  }

  get correctionOfEntryId() {
    return this.props.correctionOfEntryId;
  }

  get medicines() {
    return this.props.medicines;
  }

  static create(props: EntryDetailsProps) {
    return new EntryDetails(props);
  }
}
