import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { UpdateMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/update-medicine-variant'
import type { UpdateMedicineVariantDto } from './dtos/update-medicine-variant-dto'
import { MedicineVariantAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/_errors/medicine-variant-already-exists-error'

@ApiTags('medicinevariant')
@ApiBearerAuth()
@Controller('/medicinevariant')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER)
export class UpdateMedicineVariantController {
  constructor(
    private updateMedicineVariant: UpdateMedicineVariantUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') medicineVariantId: string,
    @Body() body: UpdateMedicineVariantDto) {
    const { dosage, pharmaceuticalFormId, unitMeasureId } = body

    const result = await this.updateMedicineVariant.execute({
      medicineVariantId,
      dosage,
      pharmaceuticalFormId,
      unitMeasureId,
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
