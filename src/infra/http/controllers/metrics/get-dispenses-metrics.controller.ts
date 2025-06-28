import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetDispenseMetricsUseCase } from '@/domain/pharma/application/use-cases/metrics/get-dispense-metrics'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('/metrics/dispense')
export class GetDispenseMetricsController {
  constructor(private GetDispensesMetrics: GetDispenseMetricsUseCase) {}

  @Get(':institutionId')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('institutionId') institutionId: string) {
    const result = await this.GetDispensesMetrics.execute({ institutionId })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { dispense } = result.value

    return {
      dispense,
    }
  }
}
