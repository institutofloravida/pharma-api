import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'

interface UpdateMedicineStockMinimumLevelUseCaseRequest {
  medicineStockId: string
  minimumLevel: number
}

type UpdateMedicineStockMinimumLevelUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

@Injectable()
export class UpdateMedicineStockMinimumLevelUseCase {
  constructor(private medicinesStockRepository: MedicinesStockRepository) {}

  async execute({
    medicineStockId,
    minimumLevel,
  }: UpdateMedicineStockMinimumLevelUseCaseRequest): Promise<UpdateMedicineStockMinimumLevelUseCaseResponse> {
    const medicineStock =
      await this.medicinesStockRepository.findById(medicineStockId)

    if (!medicineStock) {
      return left(new ResourceNotFoundError())
    }

    medicineStock.minimumLevel = minimumLevel

    await this.medicinesStockRepository.save(medicineStock)

    return right(null)
  }
}
