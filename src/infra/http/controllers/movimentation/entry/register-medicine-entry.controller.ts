import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RegisterMedicineEntryUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/register-medicine-entry';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { RegisterMedicineEntryDto } from './dtos/register-medicine-entry.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('entry')
@ApiBearerAuth()
@Controller('medicine-entry')
@UseGuards(JwtAuthGuard)
export class RegisterMedicineEntryController {
  constructor(private registerMedicineEntry: RegisterMedicineEntryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: RegisterMedicineEntryDto,
  ) {
    const {
      entryDate,
      movementTypeId,
      nfNumber,
      medicines,
      stockId,
      entryType,
    } = body;

    const result = await this.registerMedicineEntry.execute({
      medicines,
      movementTypeId,
      operatorId: user.sub,
      stockId,
      entryDate,
      nfNumber,
      entryType,
      transferId: undefined,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
