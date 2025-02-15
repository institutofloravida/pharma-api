import { UpdatePharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/update-pharmaceutical-form'
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdatePharmaceuticalFormDto } from './dtos/update-pharmaceutical-form.dto'
import { PharmaceuticalFormAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/_errors/pharmaceutical-form-already-exists-error'

@ApiTags('pharmaceutical-form')
@ApiBearerAuth()
@Controller('/pharmaceutical-form')
export class UpdatePharmaceuticalFormController {
  constructor(
    private updatePharmaceuticalForm: UpdatePharmaceuticalFormUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') pharmaceuticalformId: string,
    @Body() body: UpdatePharmaceuticalFormDto) {
    const { name } = body

    const result = await this.updatePharmaceuticalForm.execute({
      pharmaceuticalformId,
      content: name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PharmaceuticalFormAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
