import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/role-decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { DeactivateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/deactivate-stock';

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
export class DeactivateStockController {
  constructor(private deactivateStock: DeactivateStockUseCase) {}

  @Patch('/:id/deactivate')
  @HttpCode(200)
  async handle(@Param('id') stockId: string) {
    const result = await this.deactivateStock.execute({
      stockId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
