import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreatePharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/create-pharmaceutical-form'
import { PharmaceuticalFormPresenter } from '../../../presenters/pharmaceutical-form-presenter'
import { CreatePharmaceuticalFormDto } from './dtos/create-pharmaceutical-form.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('pharmaceutical-form')
@ApiBearerAuth()
@Controller('/pharmaceutical-form')
@UseGuards(JwtAuthGuard)
export class CreatePharmaceuticalFormController {
  constructor(
    private createPharmaceuticalForm: CreatePharmaceuticalFormUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreatePharmaceuticalFormDto) {
    const { name } = body

    const result = await this.createPharmaceuticalForm.execute({
      content: name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { pharmaceutical_form: PharmaceuticalFormPresenter.toHTTP(result.value.pharmaceuticalForm) }
  }
}
