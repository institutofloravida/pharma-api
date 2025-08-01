import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/update-medicine-variant'
import { UpdateMedicineVariantDto } from './dtos/update-medicine-variant-dto'
import { MedicineVariantAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/_errors/medicine-variant-already-exists-error'

@ApiTags('medicine-variant')
@ApiBearerAuth()
@Controller('/medicine-variant')
export class UpdateMedicineVariantController {
  constructor(
    private updateMedicineVariant: UpdateMedicineVariantUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') medicineVariantId: string,
    @Body() body: UpdateMedicineVariantDto) {
    const { dosage, pharmaceuticalFormId, unitMeasureId, complement } = body

    const result = await this.updateMedicineVariant.execute({
      medicineVariantId,
      dosage,
      pharmaceuticalFormId,
      unitMeasureId,
      complement,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MedicineVariantAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
