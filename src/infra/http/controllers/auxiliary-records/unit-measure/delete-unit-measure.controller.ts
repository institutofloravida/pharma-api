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
import { DeleteUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/delete-unit-measure';
import { UnitMeasureHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/_errors/unit-measure-has-dependency';

@ApiTags('unit-measure')
@ApiBearerAuth()
@Controller('/unit-measure')
export class DeleteUnitMeasureController {
  constructor(private deleteUnitMeasure: DeleteUnitMeasureUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deleteUnitMeasure.execute({
      unitMeasureId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UnitMeasureHasDependencyError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
