import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { MedicinePresenter } from '@/infra/http/presenters/medicine-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchMedicinesDto } from './dtos/fetch-medicines.dto'
import { FetchMedicinesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/fetch-medicines'

@ApiTags('medicine')
@ApiBearerAuth()
@Controller('/medicines')
export class FetchMedicinesController {
  constructor(private fetchMedicines: FetchMedicinesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchMedicinesDto) {
    const { page, query, therapeuticClassesIds } = queryParams

    const result = await this.fetchMedicines.execute({ page, content: query, therapeuticClassesIds })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { medicines, meta } = result.value

    return {
      medicines: medicines.map(MedicinePresenter.toHTTP),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    }
  }
}
