import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Gender, Race } from '../patient'
import { ValueObject } from '@/core/entities/value-object'
import { Pathology } from '../pathology'

export interface PatientDetailsProps {
  patientId: UniqueEntityId
  name: string;
  cpf?: string | null;
  sus: string;
  birthDate: Date;
  gender: Gender;
  race: Race;
  pathologies: Pathology[];
  generalRegistration?: string | null;
  address: {
    id: UniqueEntityId | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode?: string | null;
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class PatientDetails extends ValueObject<PatientDetailsProps> {
  get patientId() {
    return this.props.patientId
  }

  get name() {
    return this.props.name
  }

  get cpf(): string | null {
    return this.props.cpf
      ? this.props.cpf
      : null
  }

  public getFormattedCpf(): string | null {
    return this.cpf
      ? this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
      : null
  }

  get sus() {
    return this.props.sus
  }

  public getFormattedSus(): string {
    return this.sus.replace(/^(\d{3})(\d{4})(\d{4})(\d{4})$/, '$1 $2 $3 $4')
  }

  get birthDate() {
    return this.props.birthDate
  }

  get gender() {
    return this.props.gender
  }

  get race() {
    return this.props.race
  }

  get pathologies() {
    return this.props.pathologies
  }

  get generalRegistration() {
    return this.props.generalRegistration ?? null
  }

  get address() {
    return this.props.address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  calculateAge(birthDate: Date): number {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1
    }

    return age
  }

  static create(props: PatientDetailsProps) {
    return new PatientDetails(props)
  }
}
