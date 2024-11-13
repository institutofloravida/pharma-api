import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchPharmaceuticalFormsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { PharmaceuticalFormPresenter } from '../../../presenters/pharmaceutical-form-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/pharmaceutical-form')
export class FetchPharmaceuticalFormController {
  constructor(private fetchPharmaceuticalForms: FetchPharmaceuticalFormsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchPharmaceuticalForms.execute({
      page,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const pharmaceuticalForms = result.value.pharmaceuticalForms

    return { pharmaceutical_forms: pharmaceuticalForms.map(PharmaceuticalFormPresenter.toHTTP) }
  }
}
