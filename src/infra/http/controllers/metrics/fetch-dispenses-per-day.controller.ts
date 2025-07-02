import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchDispensesPerDayUseCase } from '@/domain/pharma/application/use-cases/metrics/fetch-dispenses-per-day'
import { FetchDispensesPerDayDto } from './dtos/fetch-dispenses-per-day.dto'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('/charts/dispenses-per-day')
export class FetchDispensesPerDayController {
  constructor(private fetchDispensesPerDay: FetchDispensesPerDayUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchDispensesPerDayDto) {
    const { institutionId, startDate, endDate } = queryParams

    const result = await this.fetchDispensesPerDay.execute({
      institutionId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { dispenses, meta } = result.value

    return {
      dispenses,
      meta: {
        totalCount: meta.totalCount,
      },
    }
  }
}
