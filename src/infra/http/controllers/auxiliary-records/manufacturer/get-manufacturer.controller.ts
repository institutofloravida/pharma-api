import {
  BadRequestException,
  Controller,
  Get,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ManufacturerPresenter } from '../../../presenters/manufacturer-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/get-manufacturer'

@ApiTags('manufacturer')
@ApiBearerAuth()
@Controller('/manufacturer')
export class GetManufacturerController {
  constructor(private getManufacturer: GetManufacturerUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getManufacturer.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const manufacturer = result.value

    return {
      manufacturer: ManufacturerPresenter.toHTTP(manufacturer),
    }
  }
}
