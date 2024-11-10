import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { CreateStockUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/stock/create-stock'
import { InstitutionNotExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/_errors/institution-not-exists-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'

const createStockBodySchema = z.object({
  name: z.string(),
  status: z.boolean().optional(),
  institutionId: z.string(),
})

type CreateStockBodySchema = z.infer<typeof createStockBodySchema>

@Controller('/stocks')

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class CreateStockController {
  constructor(
    private createStock: CreateStockUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createStockBodySchema))
  async handle(@Body() body: CreateStockBodySchema) {
    const { name, status, institutionId } = body
    const result = await this.createStock.execute({
      content: name,
      institutionId,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InstitutionNotExistsError:
          throw new ResourceNotFoundError()
        default:
          throw new BadRequestException(error.message)
      }
    }
    return { stock: result.value.stock }
  }
}
