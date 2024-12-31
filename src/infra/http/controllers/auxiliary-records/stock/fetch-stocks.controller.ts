import {
  BadRequestException,
  Controller,
  Get,
  ParseArrayPipe,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'MANAGER')
export class FetchStocksController {
  constructor(private fetchStocks: FetchStocksUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() queryParams: FetchStocksDto,
    @Query(
      'institutionsIds',
      new ParseArrayPipe({ items: String, optional: true }),
    )
    institutionsIds: string[],
  ) {
    const userId = user.sub
    const { page } = queryParams

    const result = await this.fetchStocks.execute({
      page,
      institutionsIds,
      operatorId: userId,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const stocks = result.value.stocks

    return { stocks: stocks.map(StockPresenter.toHTTP) }
  }
}
