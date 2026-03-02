import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetStockSettingsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/get-stock-settings'
import { StockNotFoundError } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/_errors/stock-not-found-error'

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard)
export class GetStockSettingsController {
  constructor(private getStockSettings: GetStockSettingsUseCase) {}

  @Get(':id/settings')
  async handle(@Param('id') stockId: string) {
    const result = await this.getStockSettings.execute({ stockId })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case StockNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { settings: result.value.settings }
  }
}
