import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import { PharmaceuticalFormHasDependencyError } from './_errors/pharmaceutical-form-has-dependency-error'
import { PharmaceuticalFormNotFoundError } from './_errors/pharmaceutical-form-not-found'
import { PharmaceuticalFormsRepository } from '../../../repositories/pharmaceutical-forms-repository'

interface deletePharmaceuticalFormUseCaseRequest {
  pharmaceuticalFormId: string
}

type deletePharmaceuticalFormUseCaseResponse = Either<
  ResourceNotFoundError | PharmaceuticalFormHasDependencyError,
  null
>

@Injectable()
export class DeletePharmaceuticalFormUseCase {
  constructor(private pharmaceuticalFormsRepository: PharmaceuticalFormsRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({ pharmaceuticalFormId }: deletePharmaceuticalFormUseCaseRequest): Promise<deletePharmaceuticalFormUseCaseResponse> {
    const medicine = await this.pharmaceuticalFormsRepository.findById(pharmaceuticalFormId)
    if (!medicine) {
      return left(new PharmaceuticalFormNotFoundError(pharmaceuticalFormId))
    }

    const {
      meta,
    } = await this.medicinesVariantsRepository.findMany({page: 1 }, {pharmaceuticalFormId})

    const medicineHasDependency = meta.totalCount

    if (medicineHasDependency > 0) {
      return left(new PharmaceuticalFormHasDependencyError())
    }

    await this.pharmaceuticalFormsRepository.delete(pharmaceuticalFormId)

    return right(null)
  }
}
