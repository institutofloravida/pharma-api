import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMedicineDetailsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/get-medicine-details'
import { MedicineNotFoundError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/_errors/medicine-not-found-error'
import { MedicineDetailsPresenter } from '@/infra/http/presenters/medicine-datails-presenter'

@ApiTags('medicine')
@ApiBearerAuth()
@Controller('/medicine')
export class GetMedicineDetailsController {
  constructor(private getMedicineDetails: GetMedicineDetailsUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getMedicineDetails.execute({
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
      medicine: MedicineDetailsPresenter.toHTTP(medicine),
    }
  }
}
