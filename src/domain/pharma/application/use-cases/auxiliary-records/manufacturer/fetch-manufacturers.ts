import { Either, right } from '@/core/either'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'
import { Injectable } from '@nestjs/common'
import { ManufacturersRepository } from '../../../repositories/manufacturers-repository'
import type { Meta } from '@/core/repositories/meta'

interface FetchManufacturersUseCaseRequest {
  page: number;
  content?: string;
  cnpj?: string;
}

type FetchManufacturersUseCaseResponse = Either<
  null,
  {
    manufacturers: Manufacturer[];
    meta: Meta;
  }
>

@Injectable()
export class FetchManufacturersUseCase {
  constructor(private ManufacturersRepository: ManufacturersRepository) {}

  async execute({
    page,
    content,
    cnpj,
  }: FetchManufacturersUseCaseRequest): Promise<FetchManufacturersUseCaseResponse> {
    const { manufacturers, meta } = await this.ManufacturersRepository.findMany(
      { page },
      content,
      cnpj,
    )

    return right({
      manufacturers,
      meta,
    })
  }
}
