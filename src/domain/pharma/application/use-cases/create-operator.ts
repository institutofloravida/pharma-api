import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'

import { Operator, OperatorRole } from '../../enterprise/entities/operator'
import type { OperatorRepository } from '../repositories/operator-repository'
import { OperatorAlreadyExistsError } from './_errors/operator-already-exists-error'

interface createOperatorUseCaseRequest {
  name: string
  email: string
  passwordHash: string
  role?: OperatorRole
}
type createOperatorUseCaseResponse = Either<
  ConflictError,
  {
    operator: Operator
  }
>
export class CreateOperatorUseCase {
  constructor(private operatorRepository: OperatorRepository) {}
  async execute({
    name,
    email,
    passwordHash,
    role,
  }: createOperatorUseCaseRequest): Promise<createOperatorUseCaseResponse> {
    const operator = Operator.create({
      name,
      email,
      passwordHash,
      role: role ?? 'COMMON',
    })

    const operatorWithSameEmail = await this.operatorRepository.findByEmail(email)
    if (operatorWithSameEmail) {
      return left(new OperatorAlreadyExistsError(email))
    }

    await this.operatorRepository.create(operator)

    return right({
      operator,
    })
  }
}
