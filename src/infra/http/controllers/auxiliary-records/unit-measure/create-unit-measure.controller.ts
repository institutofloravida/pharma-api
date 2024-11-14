import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/create-unit-measure'
import { UnitMeasurePresenter } from '@/infra/http/presenters/unit-measure-presenter'

const createUnitMeasureBodySchema = z.object({
  name: z.string(),
  acronym: z.string().min(1).max(10),
})

type CreateUnitMeasureBodySchema = z.infer<typeof createUnitMeasureBodySchema>

@Controller('/unit-measure')

@UseGuards(JwtAuthGuard)
export class CreateUnitMeasureController {
  constructor(
    private createUnitMeasure: CreateUnitMeasureUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUnitMeasureBodySchema))
  async handle(@Body() body: CreateUnitMeasureBodySchema) {
    const { name, acronym } = body

    const result = await this.createUnitMeasure.execute({
      content: name,
      acronym,
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

    return { unit_measure: UnitMeasurePresenter.toHTTP(result.value.unitMeasure) }
  }
}
