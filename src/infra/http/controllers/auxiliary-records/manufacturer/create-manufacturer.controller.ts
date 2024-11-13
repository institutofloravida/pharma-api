import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/create-manufacturer'
import { ManufacturerPresenter } from '@/infra/http/presenters/manufacturer-presenter'

const createManufacturerBodySchema = z.object({
  name: z.string(),
  cnpj: z.string().min(14).max(14),
  description: z.string().optional(),
})

type CreateManufacturerBodySchema = z.infer<typeof createManufacturerBodySchema>

@Controller('/manufacturer')

@UseGuards(JwtAuthGuard)
export class CreateManufacturerController {
  constructor(
    private createManufacturer: CreateManufacturerUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createManufacturerBodySchema))
  async handle(@Body() body: CreateManufacturerBodySchema) {
    const { name, cnpj, description } = body

    const result = await this.createManufacturer.execute({
      content: name,
      cnpj,
      description,
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

    return { manufcturer: ManufacturerPresenter.toHTTP(result.value.manufacturer) }
  }
}
