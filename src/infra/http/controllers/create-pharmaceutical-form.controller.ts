import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreatePharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/create-pharmaceutical-form'
import { PharmaceuticalFormPresenter } from '../presenters/pharmaceutical-form-presenter'

const createPharmaceuticalFormBodySchema = z.object({
  name: z.string(),
})

type CreatePharmaceuticalFormBodySchema = z.infer<typeof createPharmaceuticalFormBodySchema>

@Controller('/pharmaceutical-form')

@UseGuards(JwtAuthGuard)
export class CreatePharmaceuticalFormController {
  constructor(
    private createPharmaceuticalForm: CreatePharmaceuticalFormUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPharmaceuticalFormBodySchema))
  async handle(@Body() body: CreatePharmaceuticalFormBodySchema) {
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
