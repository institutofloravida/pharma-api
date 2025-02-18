import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateManufacturerUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/update-manufacturer'
import { UpdateManufacturerDto } from './dtos/update-manufacturer.dto'
import { ManufacturerWithSameCnpjAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/_errors/manufacturer-with-same-cnpj-already-exists-error'
import { ManufacturerWithSameContentAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/manufacturer/_errors/manufacturer-with-same-content-already-exists-error'

@ApiTags('manufacturer')
@ApiBearerAuth()
@Controller('/manufacturer')
export class UpdateManufacturerController {
  constructor(
    private updateManufacturer: UpdateManufacturerUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') manufacturerId: string,
    @Body() body: UpdateManufacturerDto) {
    const { name, cnpj, description } = body

    const result = await this.updateManufacturer.execute({
      manufacturerId,
      content: name,
      cnpj,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ManufacturerWithSameCnpjAlreadyExistsError:
        case ManufacturerWithSameContentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
