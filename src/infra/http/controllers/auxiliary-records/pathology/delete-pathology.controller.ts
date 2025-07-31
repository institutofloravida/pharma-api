import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { DeletePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/delete-pathology'
import { PathologyHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/_erros/pathology-has-dependency-error'

@ApiTags('pathology')
@ApiBearerAuth()
@Controller('/pathology')
export class DeletePathologyController {
  constructor(private deletePathology: DeletePathologyUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deletePathology.execute({
      pathologyId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PathologyHasDependencyError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
