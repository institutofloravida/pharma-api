import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateAccountOperatorDTO } from './dtos/create-account-operator.dto'

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/accounts')
export class CreateAccountOperatorController {
  constructor(
    private registerOperator: RegisterOperatorUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountOperatorDTO) {
    const { name, email, password, role, institutionsIds } = body

    const result = await this.registerOperator.execute({
      name,
      email,
      password,
      role,
      institutionsIds,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    return result.value.operator
  }
}
