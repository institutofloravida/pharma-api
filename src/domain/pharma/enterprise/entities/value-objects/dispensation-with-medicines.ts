import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface DispensationWithMedicinesProps {
  dispensationId: UniqueEntityId;
  operatorId: UniqueEntityId;
  operator: string;
  patientId: UniqueEntityId;
  patient: string;
  dispensationDate: Date;
  items: number;
  medicines: {
    medicineStockId: UniqueEntityId;
    medicine: string;
    pharmaceuticalForm: string;
    unitMeasure: string;
    dosage: string;
    complement?: string | null;
    quantity: number;
  }[];
}

export class DispensationWithMedicines extends ValueObject<DispensationWithMedicinesProps> {
  get dispensationId() {
    return this.props.dispensationId;
  }

  get items() {
    return this.props.items;
  }

  get operatorId() {
    return this.props.operatorId;
  }

  get operator() {
    return this.props.operator;
  }

  get patientId() {
    return this.props.patientId;
  }

  get patient() {
    return this.props.patient;
  }

  get dispensationDate() {
    return this.props.dispensationDate;
  }

  get medicines() {
    return this.props.medicines;
  }

  static create(props: DispensationWithMedicinesProps) {
    return new DispensationWithMedicines(props);
  }
}
