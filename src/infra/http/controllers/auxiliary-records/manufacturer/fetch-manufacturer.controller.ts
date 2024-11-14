import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchManufacturersUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/fetch-manufacturers'
import { ManufacturerPresenter } from '@/infra/http/presenters/manufacturer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/manufacturer')
export class FetchManufacturersController {
  constructor(private fetchManufacturers: FetchManufacturersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchManufacturers.execute({
      page,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const manufacturers = result.value.manufacturers

    return { manufacturers: manufacturers.map(ManufacturerPresenter.toHTTP) }
  }
}
