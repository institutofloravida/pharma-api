import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchMedicinesUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine/fetch-medicines'
import { MedicinePresenter } from '@/infra/http/presenters/medicine-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().optional().default(''),
})

type QueryParams = z.infer<typeof queryParamsSchema>

@Controller('/medicines')
export class FetchMedicinesController {
  constructor(private fetchMedicines: FetchMedicinesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query(new ZodValidationPipe(queryParamsSchema)) queryParams: QueryParams) {
    const { page, query } = queryParams

    const result = await this.fetchMedicines.execute({ page, content: query })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const medicines = result.value.medicines

    return { medicines: medicines.map(MedicinePresenter.toHTTP) }
  }
}
