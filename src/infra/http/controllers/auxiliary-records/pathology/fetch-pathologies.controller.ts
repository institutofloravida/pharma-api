import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchPathologiesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/fetch-pathologies'
import { PathologyPresenter } from '@/infra/http/presenters/pathology-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/pathologies')
export class FetchpathologiesController {
  constructor(private fetchpathologies: FetchPathologiesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchpathologies.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const pathologies = result.value.pathologies

    return { pathologies: pathologies.map(PathologyPresenter.toHTTP) }
  }
}
