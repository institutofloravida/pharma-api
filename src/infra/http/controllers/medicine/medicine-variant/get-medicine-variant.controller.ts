import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetMedicineVariantDetailsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/get-medicine-variant-details'
import { MedicineVariantNotFoundError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/_errors/medicine-variant-not-found-error'
import { MedicineVariantWithMedicinePresenter } from '@/infra/http/presenters/medicine-variant-with-medicine-presenter'

@ApiTags('medicinevariant')
@ApiBearerAuth()
@Controller('/medicinevariant')
export class GetMedicineVariantController {
  constructor(private getMedicineVariantDetails: GetMedicineVariantDetailsUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getMedicineVariantDetails.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MedicineVariantNotFoundError:
          throw new NotFoundException()
        default:
          throw new BadRequestException({})
      }
    }

    const medicinevariant = result.value

    return {
      medicinevariant: MedicineVariantWithMedicinePresenter.toHTTP(medicinevariant),
    }
  }
}
