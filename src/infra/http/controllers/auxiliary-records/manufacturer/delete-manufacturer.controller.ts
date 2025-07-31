import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { DeleteManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/delete-manufacturer'
import { ManufacturerHasDependencyError } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/_errors/manufacturer-has-dependency-error'

@ApiTags('manufacturer')
@ApiBearerAuth()
@Controller('/manufacturer')
export class DeleteManufacturerController {
  constructor(private deleteManufacturer: DeleteManufacturerUseCase) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.deleteManufacturer.execute({
      manufacturerId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ManufacturerHasDependencyError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
