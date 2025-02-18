import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'
import { UnitMeasureNotFoundError } from './_errors/unit-measure-not-found-error'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'

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
