import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchManufacturersUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/fetch-manufacturers'
import { ManufacturerPresenter } from '@/infra/http/presenters/manufacturer-presenter'
import { ApiTags } from '@nestjs/swagger'
import { FetchManufacturersDto } from './dtos/fetch-manufacturers.dto'

@ApiTags('manufacturer')
@Controller('/manufacturer')
@Controller('/manufacturer')
export class FetchManufacturersController {
  constructor(private fetchManufacturers: FetchManufacturersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchManufacturersDto) {
    const { page } = queryParams

    const result = await this.fetchManufacturers.execute({
      page,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const manufacturers = result.value.manufacturers

    return { manufacturers: manufacturers.map(ManufacturerPresenter.toHTTP) }
  }
}
