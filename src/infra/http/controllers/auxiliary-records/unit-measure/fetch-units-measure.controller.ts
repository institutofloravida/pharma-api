import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchUnitsMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/fetch-units-measure'
import { UnitMeasurePresenter } from '@/infra/http/presenters/unit-measure-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchUnitsMeasureDto } from './dtos/fetch-units-measure.dto'

@ApiTags('unit-measure')
@ApiBearerAuth()
@Controller('/unit-measure')
export class FetchUnitsMeasureController {
  constructor(private fetchUnitsMeasure: FetchUnitsMeasureUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchUnitsMeasureDto) {
    const { page, query } = queryParams
    const result = await this.fetchUnitsMeasure.execute({
      page,
      content: query,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { unitsMeasure, meta } = result.value

    return { units_measure: unitsMeasure.map(UnitMeasurePresenter.toHTTP), meta }
  }
}
