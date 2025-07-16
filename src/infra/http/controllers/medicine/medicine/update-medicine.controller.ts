import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateMedicineUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/update-medicine'
import { MedicineAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/_errors/medicine-already-exists-error'
import { UpdateMedicineDto } from './dtos/update-medicine.dto'

@ApiTags('medicine')
@ApiBearerAuth()
@Controller('/medicine')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateMedicineController {
  constructor(
    private updateMedicine: UpdateMedicineUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') medicineId: string,
    @Body() body: UpdateMedicineDto) {
    const { name, description, therapeuticClassesIds } = body

    const result = await this.updateMedicine.execute({
      medicineId,
      content: name,
      description,
      therapeuticClassesIds,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MedicineAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
