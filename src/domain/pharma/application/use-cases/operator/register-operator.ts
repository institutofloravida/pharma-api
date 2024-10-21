import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'

import { Operator, OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { OperatorAlreadyExistsError } from '../_errors/operator-already-exists-error'
import type { HashGenerator } from '../../cryptography/hash-generator'

interface createOperatorUseCaseRequest {
  name: string
  email: string
  password: string
  role?: OperatorRole
}
type createOperatorUseCaseResponse = Either<
  ConflictError,
  {
    operator: Operator
  }
>
export class RegisterOperatorUseCase {
  constructor(
    private operatorRepository: OperatorsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    role = 'COMMON',
  }: createOperatorUseCaseRequest): Promise<createOperatorUseCaseResponse> {
    const operatorWithSameEmail = await this.operatorRepository.findByEmail(email)
    if (operatorWithSameEmail) {
      return left(new OperatorAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const operator = Operator.create({
      name,
      email,
      passwordHash,
      role,
    })

    await this.operatorRepository.create(operator)

    return right({
      operator,
    })
  }
}
