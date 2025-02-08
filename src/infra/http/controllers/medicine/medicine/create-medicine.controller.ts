import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicinePresenter } from '../../../presenters/medicine-presenter'
import { CreateMedicineDTO } from './dtos/create-medicine.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateMedicineUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/create-medicine'

@ApiTags('medicine')
@ApiBearerAuth()
@Controller('/medicine')

@UseGuards(JwtAuthGuard)
export class CreateMedicineController {
  constructor(
    private createMedicine: CreateMedicineUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateMedicineDTO) {
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
