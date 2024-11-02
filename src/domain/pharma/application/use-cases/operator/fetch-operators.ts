import { Either, right } from '@/core/either'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { Injectable } from '@nestjs/common'
import { OperatorsRepository } from '../../repositories/operators-repository'

interface FetchOperatorsUseCaseRequest {
  page: number
}

type FetchOperatorsUseCaseResponse = Either<
  null,
  {
    operators: Operator[]
  }
>

@Injectable()
export class FethOperatorsUseCase {
  constructor(private operatorsRepository: OperatorsRepository) {}

  async execute({
    page,
  }: FetchOperatorsUseCaseRequest): Promise<FetchOperatorsUseCaseResponse> {
    const operators = await this.operatorsRepository.findMany({ page })

    return right({
      operators,
    })
  }
}
