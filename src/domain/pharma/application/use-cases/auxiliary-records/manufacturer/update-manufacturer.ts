import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { ManufacturersRepository } from '../../../repositories/manufacturers-repository'
import { ManufacturerWithSameCnpjAlreadyExistsError } from './_errors/manufacturer-with-same-cnpj-already-exists-error'
import { ManufacturerWithSameContentAlreadyExistsError } from './_errors/manufacturer-with-same-content-already-exists-error'

interface updateManufacturerUseCaseRequest {
  manufacturerId: string;
  content?: string;
  cnpj?: string;
  description?: string | null;
}

type updateManufacturerUseCaseResponse = Either<
  | ResourceNotFoundError
  | ManufacturerWithSameCnpjAlreadyExistsError
  | ManufacturerWithSameContentAlreadyExistsError,
  {
    manufacturer: Manufacturer;
  }
>

@Injectable()
export class UpdateManufacturerUseCase {
  constructor(private manufacturerRepository: ManufacturersRepository) {}
  async execute({
    content,
    manufacturerId,
    cnpj,
    description,
  }: updateManufacturerUseCaseRequest): Promise<updateManufacturerUseCaseResponse> {
    const manufacturer =
      await this.manufacturerRepository.findById(manufacturerId)
    if (!manufacturer) {
      return left(new ResourceNotFoundError())
    }

    if (cnpj) {
      const manufacturerWithSameCnpj =
        await this.manufacturerRepository.findByCnpj(cnpj)
      if (
        manufacturerWithSameCnpj &&
        !manufacturerWithSameCnpj.id.equal(manufacturer.id)
      ) {
        return left(new ManufacturerWithSameCnpjAlreadyExistsError(cnpj))
      }
      manufacturer.cnpj = cnpj
    }

    if (content) {
      const manufacturerWithSameContent =
        await this.manufacturerRepository.findByContent(content)
      if (
        manufacturerWithSameContent &&
        !manufacturerWithSameContent.id.equal(manufacturer.id)
      ) {
        return left(new ManufacturerWithSameContentAlreadyExistsError(content))
      }
      manufacturer.content = content
    }
    manufacturer.description = description

    await this.manufacturerRepository.save(manufacturer)

    return right({
      manufacturer,
    })
  }
}
