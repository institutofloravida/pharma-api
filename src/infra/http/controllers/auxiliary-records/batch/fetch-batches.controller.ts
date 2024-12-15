import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchBatchesDto } from './dtos/fetch-batches.dto'
import { FetchBatchesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/batch/fetch-batches'
import { BatchPresenter } from '@/infra/http/presenters/batch-presenter'

@Controller('/batches')
export class FetchBatchesController {
  constructor(private fetchBacthes: FetchBatchesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchBatchesDto) {
    const { page, query } = queryParams
    console.log(page)
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
