import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMonthlyMedicineUtilizationUseCase } from '@/domain/pharma/application/use-cases/reports/get-monthly-medicine-utilization'
import { GetMonthlyMedicineUtilizationDto } from './dtos/get-monthly-medicine-utilization.dto'
import { UseMedicinePresenter } from '../../presenters/use-medicine-presenter'

@ApiTags('reports')
@ApiBearerAuth()
@Controller('/reports/monthly-utilization')
export class GetMonthlyMedicineUtilizationController {
  constructor(
    private GetMonthlyMedicineUtilization: GetMonthlyMedicineUtilizationUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: GetMonthlyMedicineUtilizationDto) {
    const { institutionId, month, year, stockId } = queryParams
    const result = await this.GetMonthlyMedicineUtilization.execute({
      institutionId,
      month: Number(month),
      year: Number(year),
      stockId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { totalUtilization, utilization, meta } = result.value
    const utilizationMapped = utilization.map(
      UseMedicinePresenter.toHTTP,
    )
    return {
      utilization: utilizationMapped,
      totalUtilization,
      meta,
    }
  }
}
