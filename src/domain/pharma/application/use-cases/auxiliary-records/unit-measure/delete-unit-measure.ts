import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { UnitMeasureHasDependencyError } from './_errors/unit-measure-has-dependency'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'

interface deleteUnitMeasureUseCaseRequest {
  unitMeasureId: string
}

type deleteUnitMeasureUseCaseResponse = Either<
  ResourceNotFoundError | UnitMeasureHasDependencyError,
  null
>

@Injectable()
export class DeleteUnitMeasureUseCase {
  constructor(private unitsMeasureRepository: UnitsMeasureRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({ unitMeasureId }: deleteUnitMeasureUseCaseRequest): Promise<deleteUnitMeasureUseCaseResponse> {
    const unitmeasure = await this.unitsMeasureRepository.findById(unitMeasureId)
    if (!unitmeasure) {
      return left(new ResourceNotFoundError())
    }

    const {
      meta,
    } = await this.medicinesVariantsRepository.findMany({ page: 1 }, {unitMeasureId})
    const unitmeasureHasDependency = meta.totalCount
    if (unitmeasureHasDependency > 0) {
      return left(new UnitMeasureHasDependencyError())
    }

    await this.unitsMeasureRepository.delete(unitMeasureId)

    return right(null)
  }
}
