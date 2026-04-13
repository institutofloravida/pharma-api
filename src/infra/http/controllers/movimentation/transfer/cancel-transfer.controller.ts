import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
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
import { CancelTransferUseCase } from '@/domain/pharma/application/use-cases/movimentation/transfer/cancel-transfer';
import { TransferNotFoundError } from '@/domain/pharma/application/use-cases/movimentation/transfer/_erros/transfer-not-found-error';

@ApiBearerAuth()
@ApiTags('transfer')
@Controller('movement/transfer/:id/cancel')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
@UseGuards(JwtAuthGuard)
export class CancelTransferController {
  constructor(private cancelTransferUseCase: CancelTransferUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') transferId: string,
  ) {
    const result = await this.cancelTransferUseCase.execute({
      operatorId: user.sub,
      transferId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case TransferNotFoundError:
          throw new NotFoundException(error.message);
        case ConflictException:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
