import { right, type Either } from '@/core/either'
import type { UnitMeasureRepository } from '../repositories/unit-measure-repository'
import { UnitMeasure } from '../../enterprise/entities/unitMeasure'

interface createQuestionUseCaseRequest {
  acronym: string
  content: string
}
type createQuestionUseCaseResponse = Either<
  null, {
    unitMeasure: UnitMeasure
  }
>
export class CreateUnitMeasureUseCase {
  constructor(private unitMeasureRepository: UnitMeasureRepository) {}
  async execute({ acronym, content }: createQuestionUseCaseRequest): Promise<createQuestionUseCaseResponse> {
    const unitMeasure = UnitMeasure.create({
      content,
      acronym,
    })

    await this.unitMeasureRepository.create(unitMeasure)

    return right({
      unitMeasure,
    })
  }
}
