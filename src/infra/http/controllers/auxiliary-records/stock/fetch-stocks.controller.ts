import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { FetchStocksUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/fetch-stocks'
import { FetchStocksDto } from './dtos/fetch-stocks.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { StockWithInstitutionPresenter } from '@/infra/http/presenters/stock-with-institution-presenter'
import { ForbiddenError } from '@/core/erros/errors/forbidden-error'

@ApiTags('stock')
@ApiBearerAuth()
@Controller('/stocks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.SUPER_ADMIN, OperatorRole.MANAGER)
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
      operatorId: userId,
      content: query,
      institutionsIds,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ForbiddenError:
          throw new ForbiddenException()
        default:
          throw new BadRequestException()
      }
    }

    const {
      stocks,
      meta,
    } = result.value

    return { stocks: stocks.map(StockWithInstitutionPresenter.toHTTP), meta }
  }
}
