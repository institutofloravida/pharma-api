import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { MedicineVariantWithMedicinePresenter } from '@/infra/http/presenters/medicine-variant-with-medicine-presenter'
import { FetchMedicinesVariantsDto } from './dtos/fetch-medicine-variant.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchMedicinesVariantsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/fetch-medicines-variants'

@ApiTags('medicine-variant')
@ApiBearerAuth()
@Controller('/medicines-variants')
export class FetchMedicinesVariantsController {
  constructor(private fetchMedicinesVariants: FetchMedicinesVariantsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query() queryParams: FetchMedicinesVariantsDto,
  ) {
    const { page, query, medicineId } = queryParams
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
