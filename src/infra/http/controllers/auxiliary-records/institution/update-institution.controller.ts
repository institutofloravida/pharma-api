import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { InstitutionWithSameCnpjAlreadyExistsError } from '@/domain/pharma/application/use-cases/institution/_errors/institution-with-same-cnpj-already-exists-error'
import { InstitutionWithSameContentAlreadyExistsError } from '@/domain/pharma/application/use-cases/institution/_errors/institution-with-same-content-already-exists-error'
import { UpdateInstitutionUseCase } from '@/domain/pharma/application/use-cases/institution/update-institution'
import { UpdateInstitutionDto } from './dtos/update-institution.dto'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

@ApiTags('institution')
@ApiBearerAuth()
@Controller('/institution')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.SUPER_ADMIN)
export class UpdateInstitutionController {
  constructor(
    private updateInstitution: UpdateInstitutionUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') institutionId: string,
    @Body() body: UpdateInstitutionDto) {
    const { name, cnpj, description } = body

    const result = await this.updateInstitution.execute({
      institutionId,
      cnpj,
      content: name,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InstitutionWithSameCnpjAlreadyExistsError:
        case InstitutionWithSameContentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
