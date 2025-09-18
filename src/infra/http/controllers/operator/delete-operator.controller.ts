import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/role-decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { DeleteOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/delete-operator';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { OperatorAlreadyHasCarriedOperationsError } from '@/domain/pharma/application/use-cases/operator/_errors/operator-has-already-carried-out-operations-error';

@ApiTags('operator')
@ApiBearerAuth()
@Controller('/operator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
export class DeleteOperatorController {
  constructor(private deleteOperator: DeleteOperatorUseCase) {}

  @Delete('/:id')
  @HttpCode(200)
  async handle(@Param('id') operatorId: string) {
    const result = await this.deleteOperator.execute({
      operatorId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message);
        case OperatorAlreadyHasCarriedOperationsError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException('Erro ao deletar operador');
      }
    }
  }
}
