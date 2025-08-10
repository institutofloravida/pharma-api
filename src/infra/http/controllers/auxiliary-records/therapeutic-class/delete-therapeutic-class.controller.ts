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
import { DeleteTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/delete-therapeutic-class';
import { TherapeuticClassHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/_errors/therapeutic-class-has-dependency';

@ApiTags('therapeutic-class')
@ApiBearerAuth()
@Controller('/therapeutic-class')
export class DeleteTherapeuticClassController {
  constructor(private deleteTherapeuticClass: DeleteTherapeuticClassUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deleteTherapeuticClass.execute({
      therapeuticClassId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case TherapeuticClassHasDependencyError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {};
  }
}
