import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMetricsUseCase } from '@/domain/pharma/application/use-cases/metrics/get-metrics'
import { GetMetricsDto } from './dtos/get-metrics.dto'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('/metrics')
export class GetMetricsController {
  constructor(private GetMetrics: GetMetricsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: GetMetricsDto) {
    const { institutionId } = queryParams

    const result = await this.GetMetrics.execute({ institutionId })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { dispense, inventory, users } = result.value

    return {
      dispense,
      inventory,
      users,
    }
  }
}
