import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { RegisterOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/register-operator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateAccountOperatorDTO } from './dtos/create-account-operator.dto'
import { OperatorAlreadyExistsError } from '@/domain/pharma/application/use-cases/operator/_errors/operator-already-exists-error'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { Roles } from '@/infra/auth/role-decorator'

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
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
