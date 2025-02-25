import { left, right, type Either } from '@/core/either'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { Injectable } from '@nestjs/common'
import { OperatorNotFoundError } from './_errors/operator-not-found-error'
import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution'

interface GetOperatorUseCaseRequest {
  operatorId: string
}

type GetOperatorUseCaseResponse = Either<
  OperatorNotFoundError,
  {
    operator: OperatorWithInstitution
  }
>

@Injectable()
export class GetOperatorUseCase {
  constructor(
    private operatorRepository: OperatorsRepository,
  ) {}

  async execute({ operatorId }: GetOperatorUseCaseRequest): Promise<GetOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findByIdWithDetails(operatorId)
    if (!operator) {
      return left(new OperatorNotFoundError(operatorId))
    }

    return right({
      operator,
    })
  }
}
