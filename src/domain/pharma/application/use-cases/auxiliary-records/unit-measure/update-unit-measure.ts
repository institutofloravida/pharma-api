import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { UnitMeasureNotFoundError } from './_errors/unit-measure-not-found-error'
import { UnitMeasureWithSameContentAlreadyExistsError } from './_errors/unit-measure-with-content-already-exists-error'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'
import { UnitMeasureWithSameAcronymAlreadyExistsError } from './_errors/unit-measure-with-acronym-already-exists-error'

interface updateUnitMeasureUseCaseRequest {
  unitmeasureId: string;
  content?: string;
  acronym?: string;
}

type updateUnitMeasureUseCaseResponse = Either<
  | UnitMeasureWithSameContentAlreadyExistsError
  | UnitMeasureWithSameAcronymAlreadyExistsError,
  {
    unitMeasure: UnitMeasure;
  }
>

@Injectable()
export class UpdateUnitMeasureUseCase {
  constructor(private unitsMeasureRepository: UnitsMeasureRepository) {}
  async execute({
    content,
    acronym,
    unitmeasureId,
  }: updateUnitMeasureUseCaseRequest): Promise<updateUnitMeasureUseCaseResponse> {
    const unitMeasure =
      await this.unitsMeasureRepository.findById(unitmeasureId)
    if (!unitMeasure) {
      return left(new UnitMeasureNotFoundError(unitmeasureId))
    }

    if (content) {
      const unitMeasureWithSameContent =
        await this.unitsMeasureRepository.findByContent(content)
      if (
        unitMeasureWithSameContent &&
        !unitMeasure.id.equal(unitMeasureWithSameContent.id)
      ) {
        return left(new UnitMeasureWithSameContentAlreadyExistsError(content))
      }
      unitMeasure.content = content
    }

    if (acronym) {
      const unitMeasureWithSameAcronym =
        await this.unitsMeasureRepository.findByAcronym(acronym)
      if (
        unitMeasureWithSameAcronym &&
        !unitMeasure.id.equal(unitMeasureWithSameAcronym.id)
      ) {
        return left(new UnitMeasureWithSameAcronymAlreadyExistsError(acronym))
      }
      unitMeasure.acronym = acronym
    }

    await this.unitsMeasureRepository.save(unitMeasure)

    return right({
      unitMeasure,
    })
  }
}
