import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { Roles } from '@/infra/auth/role-decorator';
import { CorrectMedicineEntryUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/correct-medicine-entry';
import { CorrectMedicineEntryDto } from './dtos/correct-medicine-entry.dto';
import { EntryNotFoundError } from '@/domain/pharma/application/use-cases/movimentation/entry/_errors/entry-not-found-error';
import { EntryAlreadyCorrectedError } from '@/domain/pharma/application/use-cases/movimentation/entry/_errors/entry-already-corrected-error';
import { InsufficientStockForCorrectionError } from '@/domain/pharma/application/use-cases/movimentation/entry/_errors/insufficient-stock-for-correction-error';

@ApiBearerAuth()
@ApiTags('entry')
@Controller('movement/entry/:id/correct')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
export class CorrectMedicineEntryController {
  constructor(
    private correctMedicineEntryUseCase: CorrectMedicineEntryUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') entryId: string,
    @Body() body: CorrectMedicineEntryDto,
  ) {
    const result = await this.correctMedicineEntryUseCase.execute({
      entryId,
      operatorId: user.sub,
      corrections: body.corrections,
      nfNumber: body.nfNumber,
      entryDate: body.entryDate,
      movementTypeId: body.movementTypeId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EntryNotFoundError:
          throw new NotFoundException(error.message);
        case EntryAlreadyCorrectedError:
          throw new ConflictException(error.message);
        case InsufficientStockForCorrectionError:
          throw new UnprocessableEntityException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
