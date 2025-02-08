import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchMedicinesStockUseCase } from '@/domain/pharma/application/use-cases/stock/medicine-stock/fetch-medicine-stock'
import { FetchMedicinesStockDto } from './dtos/fetch-medicines-stock.dto'
import { MedicineStockDetailsPresenter } from '@/infra/http/presenters/medicine-stock-presenter'

@ApiTags('medicine-stock')
@ApiBearerAuth()
@Controller('medicine-stock')
export class FetchMedicinesStockController {
  constructor(
    private fetchMedicinesStock: FetchMedicinesStockUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchMedicinesStockDto) {
    const { page, stockId, medicineName } = queryParams
    const result = await this.fetchMedicinesStock.execute({
      page,
      stockId,
      medicineName,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { medicinesStock, meta } = result.value

    const medicinesStockPresentation = medicinesStock.map(MedicineStockDetailsPresenter.toHTTP)

    return {
      medicines_stock: medicinesStockPresentation,
      meta,
    }
  }
}
