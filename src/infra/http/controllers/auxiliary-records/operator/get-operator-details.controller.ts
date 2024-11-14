import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { OperatorPresenter } from '../../../presenters/operator-presenter'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { GetOperatorDetailsUseCase } from '@/domain/pharma/application/use-cases/operator/get-operator-details'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

@Controller('/me')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetOperatorDetailsController {
  constructor(private getOperatorDetails: GetOperatorDetailsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const operatorId = user.sub

    const result = await this.getOperatorDetails.execute({
      operatorId,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    const operator = result.value.operator

    return { operator: OperatorPresenter.toHTTP(operator) }
  }
}
