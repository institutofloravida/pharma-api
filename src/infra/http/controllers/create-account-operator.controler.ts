import { UsePipes } from '@nestjs/common'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { OperatorRole } from '@prisma/client'

export const operatorRoles = Object.values(OperatorRole) as [OperatorRole, ...OperatorRole[]]

const createAccountOperatorBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(operatorRoles).optional(),
})

type CreateAccountOperatorBodySchema = z.infer<typeof createAccountOperatorBodySchema>

@Controller('/accounts')
export class CreateAccountOperatorController {
  constructor(
    private registerOperator: RegisterOperatorUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountOperatorBodySchema))
  async handle(@Body() body: CreateAccountOperatorBodySchema) {
    const { name, email, password, role } = body

    const result = await this.registerOperator.execute({
      name,
      email,
      password,
      role,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    return result.value.operator
  }
}
