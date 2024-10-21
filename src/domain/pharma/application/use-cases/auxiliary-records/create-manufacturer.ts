import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Manufacturer } from '../../../enterprise/entities/manufacturer'
import type { ManufacturersRepository } from '../../repositories/manufacturers-repository'

interface createManufacturerUseCaseRequest {
  content: string,
  cnpj: string
  description?: string
}
type createManufacturerUseCaseResponse = Either<
  ConflictError,
  {
    manufacturer: Manufacturer
  }
>
export class CreateManufacturerUseCase {
  constructor(private manufacturerRepository: ManufacturersRepository) {}
  async execute({ content, cnpj, description }: createManufacturerUseCaseRequest): Promise<createManufacturerUseCaseResponse> {
    const manufacturer = Manufacturer.create({
      content,
      cnpj,
      description,
    })

    const contentExists = await this.manufacturerRepository.findByContent(content)
    if (contentExists) {
      return left(new ConflictError())
    }

    const cnpjExists = await this.manufacturerRepository.findByCnpj(cnpj)
    if (cnpjExists) {
      return left(new ConflictError())
    }

    await this.manufacturerRepository.create(manufacturer)

    return right({
      manufacturer,
    })
  }
}
