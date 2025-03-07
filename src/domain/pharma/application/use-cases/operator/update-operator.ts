import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import {
  type OperatorRole,
} from '@/domain/pharma/enterprise/entities/operator'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { OperatorWithSameEmailAlreadyExistsError } from './_errors/operator-with-same-email-already-exists-error'
import { NoAssociatedInstitutionError } from './_errors/no-associated-institution-error'
import { HashGenerator } from '../../cryptography/hash-generator'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface updateOperatorUseCaseRequest {
  operatorId: string;
  name?: string;
  email?: string;
  role?: OperatorRole;
  password?: string;
  institutionsIds?: string[];
}

type updateOperatorUseCaseResponse = Either<
  | ResourceNotFoundError
  | OperatorWithSameEmailAlreadyExistsError
  | NoAssociatedInstitutionError,
  null
>

@Injectable()
export class UpdateOperatorUseCase {
  constructor(
    private operatorRepository: OperatorsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    operatorId,
    email,
    name,
    institutionsIds,
    password,
    role,
  }: updateOperatorUseCaseRequest): Promise<updateOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findById(operatorId)
    if (!operator) {
      return left(new ResourceNotFoundError('Operador não encontrado'))
    }
    if (email) {
      const operatorWithSameEmail =
        await this.operatorRepository.findByEmail(email)
      if (
        operatorWithSameEmail &&
        !(operatorWithSameEmail.id.toString() === operatorId)
      ) {
        return left(new OperatorWithSameEmailAlreadyExistsError(email))
      }
      operator.email = email
    }
    if (!operator.isSuperAdmin()) {
      if (institutionsIds) {
        if (institutionsIds && institutionsIds.length < 1) {
          return left(new NoAssociatedInstitutionError())
        }
        operator.institutionsIds = institutionsIds.map(item => new UniqueEntityId(item))
      }
    }

    if (name) operator.name = name

    if (password) {
      const passwordHash = await this.hashGenerator.hash(password)

      operator.passwordHash = passwordHash
    }

    if (role) operator.role = role

    await this.operatorRepository.save(operator)

    return right(null)
  }
}
