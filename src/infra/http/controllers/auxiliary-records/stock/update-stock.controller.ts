import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/update-stock'
import { StockAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/_errors/stock-already-exists-error'
import { UpdateStockDto } from './dtos/update-stock.dto'

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateStockController {
  constructor(
    private updateStock: UpdateStockUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') stockId: string,
    @Body() body: UpdateStockDto) {
    const { name, status } = body

    const result = await this.updateStock.execute({
      stockId,
      content: name,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StockAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
