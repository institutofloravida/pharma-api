import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FethOperatorsUseCase } from '@/domain/pharma/application/use-cases/operator/fetch-operators'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { OperatorPresenter } from '../../../presenters/operator-presenter'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/operators')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'MANAGER')
export class FetchOperatorsController {
  constructor(private fetchOperators: FethOperatorsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchOperators.execute({
      page,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const operators = result.value.operators

    return { operators: operators.map(OperatorPresenter.toHTTP) }
  }
}
