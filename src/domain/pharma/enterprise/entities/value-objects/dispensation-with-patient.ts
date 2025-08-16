import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface DispensationWithPatientProps {
  dispensationId: UniqueEntityId;
  operatorId: UniqueEntityId;
  operator: string;
  patientId: UniqueEntityId;
  patient: string;
  dispensationDate: Date;
  items: number;
  exitId: UniqueEntityId;
  reversedAt?: Date | null;
}

export class DispensationWithPatient extends ValueObject<DispensationWithPatientProps> {
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

  get exitId() {
    return this.props.exitId;
  }

  get reversedAt() {
    return this.props.reversedAt;
  }

  static create(props: DispensationWithPatientProps) {
    return new DispensationWithPatient(props);
  }
}
