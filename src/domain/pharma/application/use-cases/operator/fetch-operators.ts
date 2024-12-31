import { Either, right } from '@/core/either'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { Injectable } from '@nestjs/common'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchOperatorsUseCaseRequest {
  page: number
  content?: string
}

type FetchOperatorsUseCaseResponse = Either<
  null,
  {
    operators: Operator[]
    meta: Meta
  }
>

@Injectable()
export class FethOperatorsUseCase {
  constructor(private operatorsRepository: OperatorsRepository) {}

  async execute({
    page,
    content,
  }: FetchOperatorsUseCaseRequest): Promise<FetchOperatorsUseCaseResponse> {
    const { operators, meta } = await this.operatorsRepository.findMany({ page }, content)

    return right({
      operators,
      meta,
    })
  }
}
