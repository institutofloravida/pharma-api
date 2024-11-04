import { BadRequestException, Controller, Get, ParseArrayPipe, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { FethStocksUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/fetch-stocks'
import { StockPresenter } from '../presenters/stock-presenter'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt-strategy'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/stocks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'COMMON')
export class FetchStocksController {
  constructor(private fetchStocks: FethStocksUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('institutionsIds', new ParseArrayPipe({ items: String, optional: true })) institutionsIds: string[],
  ) {
    const userId = user.sub
    const result = await this.fetchStocks.execute({ page, institutionsIds, operatorId: userId })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const stocks = result.value.stocks

    return { stocks: stocks.map(StockPresenter.toHTTP) }
  }
}
