import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import type { CreateMedicineUseCase } from '@/domain/pharma/application/use-cases/medicine/create-medicine'

const createMedicineBodySchema = z.object({
  name: z.string(),
  dosage: z.string(),

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
    const { name } = body

    const result = await this.createMedicine.execute({
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

    return { medicine: MedicinePresenter.toHTTP(result.value.medicine) }
  }
}
