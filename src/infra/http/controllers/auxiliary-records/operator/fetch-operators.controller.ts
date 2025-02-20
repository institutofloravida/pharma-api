import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { FethOperatorsUseCase } from '@/domain/pharma/application/use-cases/operator/fetch-operators'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { FetchOperatorsDto } from './dtos/fetch-operator.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OperatorWithInstitutionPresenter } from '@/infra/http/presenters/operator-with-institution-presenter'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

@ApiTags('operator')
@ApiBearerAuth()
@Controller('/operators')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.SUPER_ADMIN, OperatorRole.MANAGER)
export class FetchOperatorsController {
  constructor(private fetchOperators: FethOperatorsUseCase) {}

  @Get()
  async handle(@Query() queryParams: FetchOperatorsDto) {
    const { page, query } = queryParams
    const result = await this.fetchOperators.execute({
      page,
      name: query,
      role: 'COMMON',

    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { operators, meta } = result.value

    return { operators: operators.map(OperatorWithInstitutionPresenter.toHTTP), meta }
  }
}
