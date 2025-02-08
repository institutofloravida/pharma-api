import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { MedicineVariantPresenter } from '@/infra/http/presenters/medicine-variant-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateMedicineVariantDto } from './dtos/create-medicine-variant.dto'
import { CreateMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/create-medicine-variant'

@ApiTags('medicine-variant')
@ApiBearerAuth()
@Controller('/medicine-variant')
@UseGuards(JwtAuthGuard)
export class CreateMedicineVariantController {
  constructor(
    private createMedicineVariant: CreateMedicineVariantUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateMedicineVariantDto) {
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

    return { medicine_variant: MedicineVariantPresenter.toHTTP(result.value.medicineVariant) }
  }
}
