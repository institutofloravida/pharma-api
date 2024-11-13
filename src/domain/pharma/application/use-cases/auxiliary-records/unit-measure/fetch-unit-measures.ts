import { Either, right } from '@/core/either'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { Injectable } from '@nestjs/common'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'

interface FetchUnitsMeasureUseCaseRequest {
  page: number
}

type FetchUnitsMeasureUseCaseResponse = Either<
  null,
  {
    unitsMeasure: UnitMeasure[]
  }
>

@Injectable()
export class FetchUnitsMeasureUseCase {
  constructor(private unitsMeasureRepository: UnitsMeasureRepository) {}

  async execute({
    page,
  }: FetchUnitsMeasureUseCaseRequest): Promise<FetchUnitsMeasureUseCaseResponse> {
    const unitsMeasure = await this.unitsMeasureRepository.findMany({ page })

    return right({
      unitsMeasure,
    })
  }
}
