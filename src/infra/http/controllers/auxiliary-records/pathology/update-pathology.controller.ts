import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdatePathologyDto } from '../pathology/dtos/update-pathology.dto'
import { UpdatePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/update-pathology'
import { PathologyAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/_erros/pathology-already-exists-error'

@ApiTags('pathology')
@ApiBearerAuth()
@Controller('/pathology')
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
