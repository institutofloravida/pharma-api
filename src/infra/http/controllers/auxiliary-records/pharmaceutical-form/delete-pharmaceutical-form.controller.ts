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
import { DeletePharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/delete-pharmaceutical-form';
import { PharmaceuticalFormHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/_errors/pharmaceutical-form-has-dependency-error';

@ApiTags('pharmaceutical-form')
@ApiBearerAuth()
@Controller('/pharmaceutical-form')
export class DeletePharmaceuticalFormController {
  constructor(
    private deletePharmaceuticalForm: DeletePharmaceuticalFormUseCase,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deletePharmaceuticalForm.execute({
      pharmaceuticalFormId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PharmaceuticalFormHasDependencyError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
