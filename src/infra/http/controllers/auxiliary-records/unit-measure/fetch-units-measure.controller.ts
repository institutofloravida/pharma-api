import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchUnitsMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/fetch-units-measure'
import { UnitMeasurePresenter } from '@/infra/http/presenters/unit-measure-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().optional().default(''),
})

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema)

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller('/unit-measure')
export class FetchUnitsMeasureController {
  constructor(private fetchUnitsMeasure: FetchUnitsMeasureUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query(queryValidationPipe) queryParams: QueryParamsSchema) {
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
