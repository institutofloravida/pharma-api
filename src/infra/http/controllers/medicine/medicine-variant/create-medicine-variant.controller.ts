import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/medicine/medicine-variant/create-medicine-variant'
import { MedicineVariantPresenter } from '@/infra/http/presenters/medicine-variant-presenter'

const createMedicineVariantBodySchema = z.object({
  dosage: z.string(),
  medicineId: z.string(),
  pharmaceuticalFormId: z.string(),
  unitMeasureId: z.string(),
})

type CreateMedicineVariantBodySchema = z.infer<typeof createMedicineVariantBodySchema>

@Controller('/medicine-variant')

@UseGuards(JwtAuthGuard)
export class CreateMedicineVariantController {
  constructor(
    private createMedicineVariant: CreateMedicineVariantUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createMedicineVariantBodySchema))
  async handle(@Body() body: CreateMedicineVariantBodySchema) {
    const {
      dosage,
      medicineId,
      pharmaceuticalFormId,
      unitMeasureId,
    } = body

    const result = await this.createMedicineVariant.execute({
      dosage,
      medicineId,
      pharmaceuticalFormId,
      unitMeasureId,
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

    return { medicine: MedicineVariantPresenter.toHTTP(result.value.medicineVariant) }
  }
}
