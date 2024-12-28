import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreateManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/create-manufacturer'
import { ManufacturerPresenter } from '@/infra/http/presenters/manufacturer-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateManufacturerDTO } from './dtos/create-manufacturer.dto'

@ApiTags('manufacturer')
@ApiBearerAuth()
@Controller('/manufacturer')

@UseGuards(JwtAuthGuard)
export class CreateManufacturerController {
  constructor(
    private createManufacturer: CreateManufacturerUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateManufacturerDTO) {
    const { name, cnpj, description } = body

    const result = await this.createManufacturer.execute({
      content: name,
      cnpj,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { manufcturer: ManufacturerPresenter.toHTTP(result.value.manufacturer) }
  }
}
