import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchMedicinesEntriesQueryParamsDto } from './dtos/fetch-medicines-entries.dto'
import { FetchRegisterMedicinesEntriesUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/fetch-register-medicines-entries'
import { MedicineEntryWithMedicineVariantAndBatchPresenter } from '@/infra/http/presenters/medicine-entry-presenter'

@Controller('/medicines-entries')
export class FetchMedicinesEntriesController {
  constructor(
    private fetchMedicinesEntries: FetchRegisterMedicinesEntriesUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchMedicinesEntriesQueryParamsDto) {
    const {
      institutionId,
      page,
      medicineId,
      medicineVariantId,
      operatorId,
      stockId,
    } = queryParams

    const result = await this.fetchMedicinesEntries.execute({
      page,
      institutionId,
      medicineId,
      medicineVariantId,
      operatorId,
      stockId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { medicinesEntries, meta } = result.value

    console.log(medicinesEntries)
    return {
      medicines_entries: medicinesEntries.map(
        MedicineEntryWithMedicineVariantAndBatchPresenter.toHTTP,
      ),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    }
  }
}