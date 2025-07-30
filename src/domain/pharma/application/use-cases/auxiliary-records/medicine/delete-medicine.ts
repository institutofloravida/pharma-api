import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { MedicineHasDependencyError } from './_errors/medicine-has-dependency-error'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import { MedicineNotFoundError } from './_errors/medicine-not-found-error'

interface deleteMedicineUseCaseRequest {
  medicineId: string
}

type deleteMedicineUseCaseResponse = Either<
  ResourceNotFoundError | MedicineHasDependencyError,
  null
>

@Injectable()
export class DeleteMedicineUseCase {
  constructor(private medicinesRepository: MedicinesRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({ medicineId }: deleteMedicineUseCaseRequest): Promise<deleteMedicineUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(medicineId)
    if (!medicine) {
      return left(new MedicineNotFoundError(medicineId))
    }

    const {
      meta,
    } = await this.medicinesVariantsRepository.findMany({page: 1 }, {medicineId})

    const medicineHasDependency = meta.totalCount

    if (medicineHasDependency > 0) {
      return left(new MedicineHasDependencyError())
    }

    await this.medicinesRepository.delete(medicineId)

    return right(null)
  }
}
