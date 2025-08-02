import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/role-decorator';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DispensationMedicineUseCase } from '@/domain/pharma/application/use-cases/dispensation/dispensation-medicine';
import { DispensationDto } from './dtos/dispensation-dto';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { InstitutionNotExistsError } from '@/domain/pharma/application/use-cases/institution/_errors/institution-not-exists-error';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';

@ApiTags('dispensation')
@ApiBearerAuth()
@Controller('/dispensation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.COMMON)
export class DispensationController {
  constructor(private dispensation: DispensationMedicineUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: DispensationDto,
  ) {
    const { dispensationDate, patientId, medicines, stockId } = body;
    const result = await this.dispensation.execute({
      operatorId: user.sub,
      patientId,
      dispensationDate,
      stockId,
      medicines,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InstitutionNotExistsError:
          throw new ResourceNotFoundError();
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
