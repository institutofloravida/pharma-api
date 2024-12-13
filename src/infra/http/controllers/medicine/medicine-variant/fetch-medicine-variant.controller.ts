import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchMedicinesVariantsUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine-variant/fetch-medicines-variants'
import { MedicineVariantWithMedicinePresenter } from '@/infra/http/presenters/medicine-variant-with-medicine-presenter'

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

@Controller('/medicines-variants')
export class FetchMedicinesVariantsController {
  constructor(private fetchMedicinesVariants: FetchMedicinesVariantsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query(new ZodValidationPipe(queryParamsSchema)) queryParams: QueryParams,
    @Query('medicineId') medicineId: string,
  ) {
    const { page, query } = queryParams
    const result = await this.fetchMedicinesVariants.execute({
      page,
      medicineId,
      content: query,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { medicinesVariants, meta } = result.value
    const medicinesVariantsMappered =
    medicinesVariants.map(MedicineVariantWithMedicinePresenter.toHTTP)
    return {
      medicines_variants: medicinesVariantsMappered,
      meta,
    }
  }
}
