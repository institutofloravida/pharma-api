import { left, right, type Either } from '@/core/either'
import { UnitsMeasureRepository } from '../../../repositories/units-measure-repository'
import { UnitMeasure } from '../../../../enterprise/entities/unitMeasure'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Injectable } from '@nestjs/common'

interface createUnitMeasureUseCaseRequest {
  acronym: string
  content: string
}

type createUnitMeasureUseCaseResponse = Either<
  ConflictError,
  {
    unitMeasure: UnitMeasure
  }
>

@Injectable()
export class CreateUnitMeasureUseCase {
  constructor(private unitMeasureRepository: UnitsMeasureRepository) {}
  async execute({ acronym, content }: createUnitMeasureUseCaseRequest): Promise<createUnitMeasureUseCaseResponse> {
    const unitMeasure = UnitMeasure.create({
      content,
      acronym,
    })

    const contentExists = await this.unitMeasureRepository.findByContent(content)
    if (contentExists) {
      return left(new ConflictError())
    }

    const acronymExists = await this.unitMeasureRepository.findByAcronym(acronym)
    if (acronymExists) {
      return left(new ConflictError())
    }

    await this.unitMeasureRepository.create(unitMeasure)

    return right({
      unitMeasure,
    })
  }
}
