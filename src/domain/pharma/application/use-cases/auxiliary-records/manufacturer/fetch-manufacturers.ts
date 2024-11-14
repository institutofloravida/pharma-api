import { Either, right } from '@/core/either'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { Injectable } from '@nestjs/common'
import { ManufacturersRepository } from '../../../repositories/manufacturers-repository'

interface FetchManufacturersUseCaseRequest {
  page: number
}

type FetchManufacturersUseCaseResponse = Either<
  null,
  {
    manufacturers: Manufacturer[]
  }
>

@Injectable()
export class FetchManufacturersUseCase {
  constructor(private ManufacturersRepository: ManufacturersRepository) {}

  async execute({
    page,
  }: FetchManufacturersUseCaseRequest): Promise<FetchManufacturersUseCaseResponse> {
    const manufacturers = await this.ManufacturersRepository.findMany({ page })

    return right({
      manufacturers,
    })
  }
}
