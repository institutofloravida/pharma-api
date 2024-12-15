import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { StockPresenter } from '../../../presenters/stock-presenter'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { FetchStocksUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/fetch-stocks'
import { FetchStocksDto } from './dtos/fetch-stocks.dto'

@Controller('/stocks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'MANAGER')
export class FetchStocksController {
  constructor(private fetchStocks: FetchStocksUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() queryParams: FetchStocksDto,
  ) {
    const userId = user.sub
    const { page, query, institutionsIds } = queryParams

    const result = await this.fetchStocks.execute({
      page,
      institutionsIds,
      content: query,
      operatorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { stocks, meta } = result.value

    return { stocks: stocks.map(StockPresenter.toHTTP), meta }
  }
}
