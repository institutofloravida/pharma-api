import { left, right, type Either } from '@/core/either'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { Injectable } from '@nestjs/common'
import { Operator } from '@/domain/pharma/enterprise/entities/operator'
import { OperatorNotFoundError } from './_errors/operator-not-found-error'

interface GetDetailsOperatorUseCaseRequest {
  operatorId: string
}

type GetDetailsOperatorUseCaseResponse = Either<
  OperatorNotFoundError,
  {
    operator: Operator
  }
>

@Injectable()
export class GetOperatorDetailsUseCase {
  constructor(
    private operatorRepository: OperatorsRepository,
  ) {}

  async execute({ operatorId }: GetDetailsOperatorUseCaseRequest): Promise<GetDetailsOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findById(operatorId)
    if (!operator) {
      return left(new OperatorNotFoundError(operatorId))
    }

    return right({
      operator,
    })
  }
}
