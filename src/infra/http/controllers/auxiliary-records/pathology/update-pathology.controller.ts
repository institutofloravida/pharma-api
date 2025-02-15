import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdatePathologyDto } from '../pathology/dtos/update-pathology.dto'
import { UpdatePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/update-pathology'
import { PathologyAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/_erros/pathology-already-exists-error'

@ApiTags('pathology')
@ApiBearerAuth()
@Controller('/pathology')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MANAGER')
export class UpdatePathologyController {
  constructor(
    private updatePathology: UpdatePathologyUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') pathologyId: string,
    @Body() body: UpdatePathologyDto) {
    const { name } = body

    const result = await this.updatePathology.execute({
      pathologyId,
      content: name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PathologyAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
