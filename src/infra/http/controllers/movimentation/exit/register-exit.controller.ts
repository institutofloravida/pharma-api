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
import { ApiTags } from '@nestjs/swagger'
import { RegisterExitUseCase } from '@/domain/pharma/application/use-cases/movimentation/exit/register-exit'
import { RegisterExitDto } from './dtos/register-exit.dto'

@ApiTags('exit')
@Controller('medicine/exit/')
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
      batcheStockId,
      exitType,
      medicineStockId,
      movementTypeId,
      quantity,
      exitDate,
    } = body

    const result = await this.registerMedicineExit.execute({
      batcheStockId,
      exitType,
      medicineStockId,
      movementTypeId,
      operatorId: user.sub,
      quantity,
      exitDate,
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
