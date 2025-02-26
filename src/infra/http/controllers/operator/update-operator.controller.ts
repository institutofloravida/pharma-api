import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/update-operator'
import { UpdateOperatorDto } from './dtos/update-operator.dto'
import { OperatorWithSameEmailAlreadyExistsError } from '@/domain/pharma/application/use-cases/operator/_errors/operator-with-same-email-already-exists-error'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

@ApiTags('operator')
@ApiBearerAuth()
@Controller('/operator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER)
export class UpdateOperatorController {
  constructor(private updateOperator: UpdateOperatorUseCase) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') operatorId: string,
    @Body() body: UpdateOperatorDto,
  ) {
    const { name, email, institutionsIds, password, role } = body
    const result = await this.updateOperator.execute({
      operatorId,
      name,
      email,
      institutionsIds,
      password,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OperatorWithSameEmailAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
