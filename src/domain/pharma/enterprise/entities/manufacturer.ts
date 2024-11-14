import { Optional } from '@/core/types/optional'
import { Company, type CompanyProps } from './company'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface ManufacturerProps extends CompanyProps {}

export class Manufacturer extends Company<ManufacturerProps> {
  static create(
    props: Optional<ManufacturerProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const manufacturer = new Manufacturer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return manufacturer
  }
}
