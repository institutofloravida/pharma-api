import { left, right, type Either } from '@/core/either'

import { OperatorsRepository } from '../../repositories/operators-repository'
import { HashComparer } from '../../cryptography/hash-compare'
import { Encrypter } from '../../cryptography/encrypter'
import { WrongCredentialsError } from '../_errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

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

@Injectable()
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

    const isPasswordValid = await this.hashComparer.compare(password, operator.passwordHash)
    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypter({
      sub: operator.id.toString(),
      role: operator.role.toString(),
    })

    return right({
      accessToken,
    })
  }
}
