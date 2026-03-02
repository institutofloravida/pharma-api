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
import { UpdateMedicineStockMinimumLevelUseCase } from '@/domain/pharma/application/use-cases/inventory/update-medicine-stock-minimum-level'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class UpdateMinimumLevelDTO {
  @ApiProperty({ example: 10, description: 'Nível mínimo de estoque' })
  @IsInt()
  @Min(0)
  minimumLevel!: number
}

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('/medicine-stock')
@UseGuards(JwtAuthGuard)
export class UpdateMedicineStockMinimumLevelController {
  constructor(
    private updateMinimumLevel: UpdateMedicineStockMinimumLevelUseCase,
  ) {}

  @Patch(':id/minimum-level')
  @HttpCode(204)
  async handle(
    @Param('id') medicineStockId: string,
    @Body() body: UpdateMinimumLevelDTO,
  ) {
    const { minimumLevel } = body

    const result = await this.updateMinimumLevel.execute({
      medicineStockId,
      minimumLevel,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
