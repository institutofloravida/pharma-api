import { left, right, type Either } from '@/core/either'

import {
  Operator,
  OperatorRole,
} from '@/domain/pharma/enterprise/entities/operator'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { OperatorAlreadyExistsError } from './_errors/operator-already-exists-error'
import { HashGenerator } from '../../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NoAssociatedInstitutionError } from './_errors/no-associated-institution-error'

interface createOperatorUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role?: OperatorRole;
  institutionsIds: string[];
}

type createOperatorUseCaseResponse = Either<
  OperatorAlreadyExistsError |
  NoAssociatedInstitutionError,
  {
    operator: Operator;
  }
>

@Injectable()
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
    institutionsIds,
  }: createOperatorUseCaseRequest): Promise<createOperatorUseCaseResponse> {
    if (institutionsIds.length < 1) {
      return left(new NoAssociatedInstitutionError())
    }
    const operatorWithSameEmail =
      await this.operatorRepository.findByEmail(email)
    if (operatorWithSameEmail) {
      return left(new OperatorAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const operator = Operator.create({
      name,
      email,
      passwordHash,
      role,
      institutionsIds: institutionsIds.map(
        (institution) => new UniqueEntityId(institution),
      ),
    })

    await this.operatorRepository.create(operator)

    return right({
      operator,
    })
  }
}
