import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { UnitMeasureNotFoundError } from './_errors/unit-measure-not-found-error'

interface GetUnitMeasureUseCaseRequest {
  id: string;
}

type GetUnitMeasureUseCaseResponse = Either<UnitMeasureNotFoundError, UnitMeasure>

@Injectable()
export class GetUnitMeasureUseCase {
  constructor(private unitsMeasureRepository: UnitsMeasureRepository) {}

  async execute({
    id,
  }: GetUnitMeasureUseCaseRequest): Promise<GetUnitMeasureUseCaseResponse> {
    const unitMeasure = await this.unitsMeasureRepository.findById(id)

    if (!unitMeasure) {
      return left(new UnitMeasureNotFoundError(id))
    }

    return right(unitMeasure)
  }
}
