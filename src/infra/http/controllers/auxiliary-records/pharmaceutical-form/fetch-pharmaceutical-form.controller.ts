import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchPharmaceuticalFormsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { PharmaceuticalFormPresenter } from '../../../presenters/pharmaceutical-form-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().optional().default(''),
})

type PageQueryParamSchema = z.infer<typeof queryParamsSchema>

@Controller('/pharmaceutical-form')
export class FetchPharmaceuticalFormController {
  constructor(private fetchPharmaceuticalForms: FetchPharmaceuticalFormsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query(new ZodValidationPipe(queryParamsSchema)) queryParams: PageQueryParamSchema) {
    const { page, query } = queryParams
    const result = await this.fetchPharmaceuticalForms.execute({
      page,
      content: query,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const pharmaceuticalForms = result.value.pharmaceuticalForms

    return { pharmaceutical_forms: pharmaceuticalForms.map(PharmaceuticalFormPresenter.toHTTP) }
  }
}
