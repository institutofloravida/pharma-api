import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
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
import { ConfirmTransferUseCase } from '@/domain/pharma/application/use-cases/movimentation/transfer/confirm-transfer';

@ApiBearerAuth()
@ApiTags('transfer')
@Controller('movement/transfer/:id/confirm')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
@UseGuards(JwtAuthGuard)
export class ConfirmTransferController {
  constructor(private confirmTransferUseCase: ConfirmTransferUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') transferId: string,
  ) {
    const result = await this.confirmTransferUseCase.execute({
      operatorId: user.sub,
      transferId,
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
