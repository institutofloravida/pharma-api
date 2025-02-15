import { UpdateTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/update-therapeutic-class'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateTherapeuticClassDto } from './dtos/update-therapeutic-class.dto'
import { TherapeuticClassAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/_errors/therapeutic-class-already-exists-error'

@ApiTags('therapeutic-class')
@ApiBearerAuth()
@Controller('/therapeutic-class')
export class UpdateTherapeuticClassController {
  constructor(private updateTherapeuticClass: UpdateTherapeuticClassUseCase) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') therapeuticClassId: string,
    @Body() body: UpdateTherapeuticClassDto,
  ) {
    const { name, description } = body

    const result = await this.updateTherapeuticClass.execute({
      therapeuticClassId,
      content: name,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case TherapeuticClassAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
