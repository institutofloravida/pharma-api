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
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { Roles } from '@/infra/auth/role-decorator';
import { CreateTransferUseCase } from '@/domain/pharma/application/use-cases/movimentation/transfer/create-transfer';
import { CreateTransferDto } from './dtos/create-transfer.dto';

@ApiBearerAuth()
@ApiTags('transfer')
@Controller('movimentation/transfer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
@UseGuards(JwtAuthGuard)
export class CreateTransferController {
  constructor(private createTransfer: CreateTransferUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateTransferDto,
  ) {
    const { exitType, stockId, batches, stockDestinationId, transferDate } =
      body;
    const result = await this.createTransfer.execute({
      exitType,
      operatorId: user.sub,
      stockId,
      batches,
      stockDestinationId,
      transferDate,
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
