import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { OperatorRole } from '../operator';

export interface OperatorWithInstitutionProps {
  id: UniqueEntityId;
  name: string;
  email: string;
  status: boolean;
  institutions: {
    id: UniqueEntityId;
    name: string;
  }[];
  role: OperatorRole;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class OperatorWithInstitution extends ValueObject<OperatorWithInstitutionProps> {
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get status() {
    return this.props.status;
  }

  get institutions() {
    return this.props.institutions;
  }

  get role() {
    return this.props.role;
  }

  set role(role: OperatorRole) {
    this.props.role = role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: OperatorWithInstitutionProps) {
    return new OperatorWithInstitution(props);
  }
}
