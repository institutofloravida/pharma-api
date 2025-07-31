import { Optional } from '@/core/types/optional'
import { Company, type CompanyProps } from './company'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export enum InstitutionType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  ONG = 'ONG'
}

export interface InstitutionProps extends CompanyProps {
  responsible: string
  type: InstitutionType
  controlStock: boolean
}

export class Institution extends Company<InstitutionProps> {
  get responsible() {
    return this.props.responsible
  }

  set responsible(value: string) {
    this.props.responsible = value
  }
  
  get type() {
    return this.props.type
  }
  
  set type(value: InstitutionType) {
    this.props.type = value
  }

  get controlStock() {
    return this.props.controlStock
  }
  set controlStock(value: boolean) {
    this.props.controlStock = value
  }
  
  static create(
    props: Optional<InstitutionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const institution = new Institution(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return institution
  }
}
