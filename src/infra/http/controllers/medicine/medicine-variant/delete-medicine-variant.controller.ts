import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteMedicineVariantUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/delete-medicine-variant';
import { MedicineVariantHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine-variant/_errors/medicine-variant-has-dependency-error';

@ApiTags('medicine-variant')
@ApiBearerAuth()
@Controller('/medicine-variant')
export class DeleteMedicineVariantController {
  constructor(private deleteMedicineVariant: DeleteMedicineVariantUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deleteMedicineVariant.execute({
      medicineVariantId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case MedicineVariantHasDependencyError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
