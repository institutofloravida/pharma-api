import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ManufacturerHasDependencyError } from './_errors/manufacturer-has-dependency-error'
import { ManufacturersRepository } from '../../../repositories/manufacturers-repository'
import { BatchesRepository } from '../../../repositories/batches-repository'

interface deleteManufacturerUseCaseRequest {
  manufacturerId: string
}

type deleteManufacturerUseCaseResponse = Either<
  ResourceNotFoundError | ManufacturerHasDependencyError,
  null
>

@Injectable()
export class DeleteManufacturerUseCase {
  constructor(private manufacturersRepository: ManufacturersRepository,
    private batchesRepository: BatchesRepository,
  ) {}

  async execute({ manufacturerId }: deleteManufacturerUseCaseRequest): Promise<deleteManufacturerUseCaseResponse> {
    const Manufacturer = await this.manufacturersRepository.findById(manufacturerId)
    if (!Manufacturer) {
      return left(new ResourceNotFoundError('Fabricante não encontrado!'))
    }

    const {
      meta,
    } = await this.batchesRepository.findMany({ page: 1 })
    const manufacturerHasDependency = meta.totalCount
    if (manufacturerHasDependency > 0) {
      return left(new ManufacturerHasDependencyError())
    }

    await this.manufacturersRepository.delete(manufacturerId)

    return right(null)
  }
}
