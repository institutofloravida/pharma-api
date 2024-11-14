import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreatePathologyUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/create-pathology'
import { PathologyPresenter } from '@/infra/http/presenters/pathology-presenter'

const createPathologyBodySchema = z.object({
  name: z.string(),
})

type CreatePathologyBodySchema = z.infer<typeof createPathologyBodySchema>

@Controller('/pathology')

@UseGuards(JwtAuthGuard)
export class CreatePathologyController {
  constructor(
    private createPathology: CreatePathologyUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPathologyBodySchema))
  async handle(@Body() body: CreatePathologyBodySchema) {
    const { name } = body

    const result = await this.createPathology.execute({
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

    return { pathology: PathologyPresenter.toHTTP(result.value.pathology) }
  }
}
