import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common'

import { AuthenticateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/authenticate-operator'
import { WrongCredentialsError } from '@/domain/pharma/application/use-cases/_errors/wrong-credentials-error'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticateOperatorDTO } from './dtos/authenticate-operator.dto'

@ApiTags('auth')
@Controller('/sessions')
export class AuthenticateOperatorController {
  constructor(
    private authenticateOperator: AuthenticateOperatorUseCase,
  ) {}

  @HttpCode(200)
  @Post()
  async handle(@Body() body: AuthenticateOperatorDTO) {
    const { email, password } = body

    const result = await this.authenticateOperator.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
