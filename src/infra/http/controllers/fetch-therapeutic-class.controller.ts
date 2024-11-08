import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchTherapeuticClassesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/fetch-therapeutic-classes'
import { TherapeuticClassPresenter } from '../presenters/therapeutic-class-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/therapeutic-class')
export class FetchTerapeuticClasssController {
  constructor(private fetchTherapeuticClasses: FetchTherapeuticClassesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchTherapeuticClasses.execute({
      page,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const therapeuticClasses = result.value.therapeuticClasses

    return { therapeutic_classes: therapeuticClasses.map(TherapeuticClassPresenter.toHTTP) }
  }
}
