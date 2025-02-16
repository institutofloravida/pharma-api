import { Either, left, right } from '@/core/either'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { Injectable } from '@nestjs/common'
import { ManufacturersRepository } from '../../../repositories/manufacturers-repository'
import { ManufacturerNotFoundError } from './_errors/manufacturer-not-found-error'

interface GetManufacturerUseCaseRequest {
  id: string;
}

type GetManufacturerUseCaseResponse = Either<ManufacturerNotFoundError, Manufacturer>

@Injectable()
export class GetManufacturerUseCase {
  constructor(private manufacturersRepository: ManufacturersRepository) {}

  async execute({
    id,
  }: GetManufacturerUseCaseRequest): Promise<GetManufacturerUseCaseResponse> {
    const manufacturer = await this.manufacturersRepository.findById(id)

    if (!manufacturer) {
      return left(new ManufacturerNotFoundError(id))
    }

    return right(manufacturer)
  }
}
