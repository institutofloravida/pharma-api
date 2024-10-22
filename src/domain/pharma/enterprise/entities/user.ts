import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export type Gender = 'M' | 'F' | 'O'
export type Race = 'black' | 'white' | 'yellow' | 'mixed' | 'undeclared' | 'indigenous'

export interface UserProps {
  name: string
  cpf: string
  sus: string
  birthDate: Date
  gender: Gender
  race: Race
  pathologiesIds: UniqueEntityId[]
  generalRegistration?: string | null
  addressId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends AggregateRoot<UserProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(value: string) {
    this.props.cpf = value
    this.touch()
  }

  public getFormattedCpf(): string {
    return this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  get sus() {
    return this.props.sus
  }

  set sus(value: string) {
    this.props.sus = value
    this.touch()
  }

  public getFormattedSus(): string {
    return this.sus.replace(/^(\d{3})(\d{4})(\d{4})(\d{4})$/, '$1 $2 $3 $4')
  }

  get birthDate() {
    return this.props.birthDate
  }

  set birthDate(value: Date) {
    this.props.birthDate = value
    this.touch()
  }

  get gender() {
    return this.props.gender
  }

  set gender(value: Gender) {
    this.props.gender = value
    this.touch()
  }

  get race() {
    return this.props.race
  }

  set race(value: Race) {
    this.props.race = value
    this.touch()
  }

  get pathologiesIds() {
    return this.props.pathologiesIds
  }

  set pathologiesIds(value: UniqueEntityId[]) {
    this.props.pathologiesIds = value
    this.touch()
  }

  get generalRegistration() {
    return this.props.generalRegistration ?? null
  }

  set generalRegistration(value: string | null) {
    this.props.generalRegistration = value
    this.touch()
  }

  get addressId() {
    return this.props.addressId
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

  calculateAge(birthDate: Date): number {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }

    return age
  }

  static create(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      generalRegistration: props.generalRegistration ?? null,
    }, id)

    return user
  }
}
