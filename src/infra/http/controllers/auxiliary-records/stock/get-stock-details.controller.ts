import {
  BadRequestException,
  Controller,
  Get,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetStockDetailsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/get-stock-details'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { StockWithInstitutionPresenter } from '@/infra/http/presenters/stock-with-institution-presenter'

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.SUPER_ADMIN, OperatorRole.MANAGER)
export class GetStockDetailsController {
  constructor(private getStockDetails: GetStockDetailsUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getStockDetails.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const stock = result.value

    return {
      stock: StockWithInstitutionPresenter.toHTTP(stock),
    }
  }
}
