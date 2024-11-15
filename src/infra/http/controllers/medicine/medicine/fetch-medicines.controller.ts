import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchMedicinesUseCase } from '@/domain/pharma/application/use-cases/medicine/fetch-medicines'
import { MedicinePresenter } from '@/infra/http/presenters/medicine-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/medicines')
export class FetchmedicinesController {
  constructor(private fetchmedicines: FetchMedicinesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchmedicines.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const medicines = result.value.medicines

    return { medicines: medicines.map(MedicinePresenter.toHTTP) }
  }
}
