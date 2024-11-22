import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateMedicineUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine/create-medicine'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicinePresenter } from '../../../presenters/medicine-presenter'

const createMedicineBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  therapeuticClassesIds: z.array(z.string()),
})

type CreateMedicineBodySchema = z.infer<typeof createMedicineBodySchema>

@Controller('/medicine')

@UseGuards(JwtAuthGuard)
export class CreateMedicineController {
  constructor(
    private createMedicine: CreateMedicineUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createMedicineBodySchema))
  async handle(@Body() body: CreateMedicineBodySchema) {
    const {
      name,
      therapeuticClassesIds,
      description,
    } = body

    const result = await this.createMedicine.execute({
      content: name,
      therapeuticClassesIds: therapeuticClassesIds.map(item => new UniqueEntityId(item)),
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

    return { medicine: MedicinePresenter.toHTTP(result.value.medicine) }
  }
}
