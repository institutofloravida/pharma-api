import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { CreateInstitutionDTO } from './dtos/create-institution.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateInstitutionUseCase } from '@/domain/pharma/application/use-cases/institution/create-institution'
import { InstitutionWithSameCnpjAlreadyExistsError } from '@/domain/pharma/application/use-cases/institution/_errors/institution-with-same-cnpj-already-exists-error'
import { InstitutionWithSameContentAlreadyExistsError } from '@/domain/pharma/application/use-cases/institution/_errors/institution-with-same-content-already-exists-error'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

@ApiTags('institution')
@ApiBearerAuth()
@Controller('/institution')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.SUPER_ADMIN)
export class CreateInstitutionController {
  constructor(
    private createInstitution: CreateInstitutionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateInstitutionDTO) {
    const { name, cnpj, description, controlStock, type, responsible } = body

    const result = await this.createInstitution.execute({
      cnpj,
      content: name,
      description,
      controlStock,
      responsible,
      type,
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

    return { institution: result.value.institution }
  }
}
