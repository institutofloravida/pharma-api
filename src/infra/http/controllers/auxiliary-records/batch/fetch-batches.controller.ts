import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchBatchesDto } from './dtos/fetch-batches.dto'
import { FetchBatchesUseCase } from '@/domain/pharma/application/use-cases/stock/batch/fetch-batches'
import { BatchPresenter } from '@/infra/http/presenters/batch-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Bathes')
@ApiBearerAuth()
@Controller('/batches')
export class FetchBatchesController {
  constructor(private fetchBacthes: FetchBatchesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchBatchesDto) {
    const { page, query } = queryParams

    const result = await this.fetchBacthes.execute({
      page,
      content: query,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { batches, meta } = result.value

    return { batches: batches.map(BatchPresenter.toHTTP), meta }
  }
}
