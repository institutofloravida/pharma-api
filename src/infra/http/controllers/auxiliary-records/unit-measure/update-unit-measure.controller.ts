import { BadRequestException, Body, ConflictException, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdateUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/update-unit-measure'
import { UpdateUnitMeasureDto } from './dtos/update-unit-measure-dto'
import { UnitMeasureWithSameAcronymAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/_errors/unit-measure-with-acronym-already-exists-error'
import { UnitMeasureWithSameContentAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/_errors/unit-measure-with-content-already-exists-error'

@ApiTags('unit-measure')
@ApiBearerAuth()
@Controller('/unit-measure')
export class UpdateUnitMeasureController {
  constructor(
    private updateUnitMeasure: UpdateUnitMeasureUseCase,
  ) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') unitmeasureId: string,
    @Body() body: UpdateUnitMeasureDto) {
    const { name, acronym } = body

    const result = await this.updateUnitMeasure.execute({
      unitmeasureId,
      content: name,
      acronym,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UnitMeasureWithSameAcronymAlreadyExistsError:
        case UnitMeasureWithSameContentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
