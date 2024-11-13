import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchUnitsMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/fetch-units-measure'
import { UnitMeasurePresenter } from '@/infra/http/presenters/unit-measure-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/unit-measure')
export class FetchUnitsMeasureController {
  constructor(private fetchUnitsMeasure: FetchUnitsMeasureUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchUnitsMeasure.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const unitsmeasure = result.value.unitsMeasure

    return { units_measure: unitsmeasure.map(UnitMeasurePresenter.toHTTP) }
  }
}
