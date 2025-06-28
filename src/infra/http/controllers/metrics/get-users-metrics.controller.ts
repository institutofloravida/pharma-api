import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetUsersMetricsUseCase } from '@/domain/pharma/application/use-cases/metrics/get-users-metrics'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('/metrics/users')
export class GetUsersMetricsController {
  constructor(private GetUsersMetrics: GetUsersMetricsUseCase) {}

  @Get(':institutionId')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('institutionId') institutionId: string) {
    const result = await this.GetUsersMetrics.execute({ institutionId })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { users } = result.value

    return {
      users,
    }
  }
}
