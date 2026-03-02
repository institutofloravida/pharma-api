import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpsertStockSettingsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/upsert-stock-settings'
import { StockNotFoundError } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/_errors/stock-not-found-error'
import { IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class UpsertStockSettingsDTO {
  @ApiProperty({ example: 30, description: 'Dias de aviso antes do vencimento' })
  @IsInt()
  @Min(1)
  expirationWarningDays!: number
}

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard)
export class UpsertStockSettingsController {
  constructor(private upsertStockSettings: UpsertStockSettingsUseCase) {}

  @Patch(':id/settings')
  @HttpCode(200)
  async handle(
    @Param('id') stockId: string,
    @Body() body: UpsertStockSettingsDTO,
  ) {
    const { expirationWarningDays } = body

    const result = await this.upsertStockSettings.execute({
      stockId,
      expirationWarningDays,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case StockNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { settings: { expirationWarningDays: result.value.settings.expirationWarningDays } }
  }
}
