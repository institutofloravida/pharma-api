import { left, right, type Either } from '@/core/either'

import { OperatorsRepository } from '../repositories/operators-repository'
import type { HashComparer } from '../cryptography/hash-compare'
import type { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './_errors/wrong-credentials-error'

interface AuthenticateOperatorUseCaseRequest {
  email: string
  password: string
}
type AuthenticateOperatorUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>
export class AuthenticateOperatorUseCase {
  constructor(
    private operatorRepository: OperatorsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateOperatorUseCaseRequest): Promise<AuthenticateOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findByEmail(email)
    if (!operator) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = this.hashComparer.compare(password, operator.passwordHash)

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypter({
      sub: operator.id.toString(),
    })

    await this.operatorRepository.create(operator)

    return right({
      accessToken,
    })
  }
}
