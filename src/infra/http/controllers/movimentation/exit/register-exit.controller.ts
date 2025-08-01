import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RegisterExitUseCase } from '@/domain/pharma/application/use-cases/movimentation/exit/register-exit'
import { RegisterExitDto } from './dtos/register-exit.dto'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { Roles } from '@/infra/auth/role-decorator'

@ApiBearerAuth()
@ApiTags('exit')
@Controller('medicine/exit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)

@UseGuards(JwtAuthGuard)
export class RegisterMedicineExitController {
  constructor(private registerMedicineExit: RegisterExitUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: RegisterExitDto,
  ) {
    const {
      exitType,
      movementTypeId,
      exitDate,
      stockId,
      batches,
      destinationInstitutionId,
    } = body

    const result = await this.registerMedicineExit.execute({
      exitType,
      movementTypeId,
      operatorId: user.sub,
      exitDate,
      stockId,
      destinationInstitutionId,
      batches,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
