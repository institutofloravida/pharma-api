import { Either, right } from '@/core/either'
import { UnitMeasure } from '@/domain/pharma/enterprise/entities/unitMeasure'
import { Injectable } from '@nestjs/common'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchUnitsMeasureUseCaseRequest {
  page: number
  content?: string
}

type FetchUnitsMeasureUseCaseResponse = Either<
  null,
  {
    unitsMeasure: UnitMeasure[]
    meta: Meta
  }
>

@Injectable()
export class FetchUnitsMeasureUseCase {
  constructor(private unitsMeasureRepository: UnitsMeasureRepository) {}

  async execute({
    page,
    content,
  }: FetchUnitsMeasureUseCaseRequest): Promise<FetchUnitsMeasureUseCaseResponse> {
    const { unitsMeasure, meta } = await this.unitsMeasureRepository.findMany({ page }, content)

    return right({
      unitsMeasure,
      meta,
    })
  }
}
