import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FethInstitutionsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/fetch-institutions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { InstitutionPresenter } from '../../../presenters/institution-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/institutions')
export class FetchInstitutionsController {
  constructor(private fetchInstitutions: FethInstitutionsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchInstitutions.execute({
      page,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const institutions = result.value.institutions

    return { institutions: institutions.map(InstitutionPresenter.toHTTP) }
  }
}
