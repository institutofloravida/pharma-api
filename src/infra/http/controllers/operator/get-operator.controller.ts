import { BadRequestException, Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OperatorNotFoundError } from '@/domain/pharma/application/use-cases/operator/_errors/operator-not-found-error'
import { OperatorWithInstitutionPresenter } from '../../presenters/operator-with-institution-presenter'
import { GetOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/get-operator'

@ApiTags('operator')
@ApiBearerAuth()
@Controller('/operator')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetOperatorController {
  constructor(private getOperatorDetails: GetOperatorUseCase) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getOperatorDetails.execute({
      operatorId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OperatorNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    const { operator } = result.value

    return { operator: OperatorWithInstitutionPresenter.toHTTP(operator) }
  }
}
