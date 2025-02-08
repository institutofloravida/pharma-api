import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { FetchBatchesStockDto } from './dtos/fetch-batches-stock.dto'
import { FetchBatchesStockUseCase } from '@/domain/pharma/application/use-cases/stock/batch-stock/fetch-batches-stock'
import { BatchStockWithBatchPresenter } from '@/infra/http/presenters/batch-stock-with-batch-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('batch-stock')
@ApiBearerAuth()
@Controller('batch-stock')
export class FetchBatchesStockController {
  constructor(
    private fetchBatchesStock: FetchBatchesStockUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchBatchesStockDto) {
    const { medicineStockId, page, stockId, code } = queryParams

    const result = await this.fetchBatchesStock.execute({
      medicineStockId,
      stockId,
      page,
      code,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { batchesStock, meta } = result.value

    const batchesStockPresentation = batchesStock.map(BatchStockWithBatchPresenter.toHTTP)

    return {
      batches_stock: batchesStockPresentation,
      meta,
    }
  }
}
