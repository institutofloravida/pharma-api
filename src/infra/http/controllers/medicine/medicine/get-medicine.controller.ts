import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { MedicinePresenter } from '../../../presenters/medicine-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMedicineUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/get-medicine'
import { MedicineNotFoundError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/_errors/medicine-not-found-error'

@ApiTags('medicine')
@ApiBearerAuth()
@Controller('/medicine')
export class GetMedicineController {
  constructor(private getMedicine: GetMedicineUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getMedicine.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MedicineNotFoundError:
          throw new NotFoundException()
        default:
          throw new BadRequestException({})
      }
    }

    const medicine = result.value

    return {
      medicine: MedicinePresenter.toHTTP(medicine),
    }
  }
}
