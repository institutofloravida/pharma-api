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
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { DeleteStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/delete-stock';
import { StockAlreadyHasMovimentationError } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/_errors/stock-already-has-movimentation-error';

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
export class DeleteStockController {
  constructor(private deleteStock: DeleteStockUseCase) {}

  @Delete('/:id')
  @HttpCode(200)
  async handle(@Param('id') stockId: string) {
    const result = await this.deleteStock.execute({
      stockId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message);
        case StockAlreadyHasMovimentationError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException('Erro ao deletar stock');
      }
    }
  }
}
