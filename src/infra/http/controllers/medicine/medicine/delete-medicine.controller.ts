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
import { DeleteMedicineUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/delete-medicine';
import { MedicineHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/medicine/_errors/medicine-has-dependency-error';

@ApiTags('medicine')
@ApiBearerAuth()
@Controller('/medicine')
export class DeleteMedicineController {
  constructor(private deleteMedicine: DeleteMedicineUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deleteMedicine.execute({
      medicineId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case MedicineHasDependencyError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
