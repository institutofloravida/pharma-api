import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetInventoryMetricsUseCase } from '@/domain/pharma/application/use-cases/metrics/get-inventory-metrics'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('/metrics/inventory')
export class GetInventoryMetricsController {
  constructor(private GetInventorysMetrics: GetInventoryMetricsUseCase) {}

  @Get(':institutionId')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('institutionId') institutionId: string) {
    const result = await this.GetInventorysMetrics.execute({ institutionId })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { inventory } = result.value

    return {
      inventory,
    }
  }
}
