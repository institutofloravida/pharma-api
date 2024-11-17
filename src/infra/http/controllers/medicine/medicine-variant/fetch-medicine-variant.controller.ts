import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchMedicinesVariantsUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine-variant/fetch-medicines-variants'
import { MedicineVariantWithMedicinePresenter } from '@/infra/http/presenters/medicine-variant-with-medicine-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/medicines-variants')
export class FetchMedicinesVariantsController {
  constructor(private fetchMedicinesVariants: FetchMedicinesVariantsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('medicineId') medicineId: string,
  ) {
    const result = await this.fetchMedicinesVariants.execute({
      page,
      medicineId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const medicinevariants = result.value.medicinesVariants

    return { medicines_variants: medicinevariants.map(MedicineVariantWithMedicinePresenter.toHTTP) }
  }
}
