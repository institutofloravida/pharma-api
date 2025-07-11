import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMovimentationInAPeriodUseCase } from '@/domain/pharma/application/use-cases/reports/get-movimentation-in-a-period'
import { GetMovimentationInAPeriodDto } from './dtos/get-movimentation-in-a-period.dto'
import { MovimentationPresenter } from '../../presenters/movimentation-presenter'

@ApiTags('reports')
@ApiBearerAuth()
@Controller('/reports/movimentation')
export class GetMovimentationInAPeriodController {
  constructor(
    private GetMovimentationInAPeriod: GetMovimentationInAPeriodUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: GetMovimentationInAPeriodDto) {
    const {
      institutionId,
      startDate,
      endDate,
      operatorId,
      batchStockId,
      exitType,
      medicineId,
      medicineStockId,
      medicineVariantId,
      movementTypeId,
      quantity,
      stockId,
    } = queryParams
    const result = await this.GetMovimentationInAPeriod.execute({
      institutionId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      operatorId,
      batcheStockId: batchStockId,
      exitType,
      medicineId,
      medicineStockId,
      medicineVariantId,
      movementTypeId,
      quantity: Number(quantity),
      stockId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { movimentations, meta } = result.value

    const movimentationsMapped = movimentations.map(MovimentationPresenter.toHTTP)
    return {
      movimentation: movimentationsMapped,
      meta,
    }
  }
}
