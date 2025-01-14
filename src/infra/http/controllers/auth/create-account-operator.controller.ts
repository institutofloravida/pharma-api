import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateAccountOperatorDTO } from './dtos/create-account-operator.dto'
import { OperatorAlreadyExistsError } from '@/domain/pharma/application/use-cases/operator/_errors/operator-already-exists-error'

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
      const error = result.value

      switch (error.constructor) {
        case OperatorAlreadyExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return result.value.operator
  }
}
