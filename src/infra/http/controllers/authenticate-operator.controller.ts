import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { AuthenticateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/authenticate-operator'

const authenticateOperatorBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateOperatorBodySchema = z.infer<typeof authenticateOperatorBodySchema>

@Controller('/sessions')
export class AuthenticateOperatorController {
  constructor(
    private authenticateOperator: AuthenticateOperatorUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateOperatorBodySchema))
  async handle(@Body() body: AuthenticateOperatorBodySchema) {
    const { email, password } = body

    const result = await this.authenticateOperator.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
