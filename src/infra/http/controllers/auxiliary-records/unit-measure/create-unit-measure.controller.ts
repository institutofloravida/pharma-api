import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreateUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/create-unit-measure'
import { UnitMeasurePresenter } from '@/infra/http/presenters/unit-measure-presenter'
import { CreateUnitMeasureDTO } from './dtos/create-unit-measure.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('unit-measure')
@ApiBearerAuth()
@Controller('/unit-measure')

@UseGuards(JwtAuthGuard)
export class CreateUnitMeasureController {
  constructor(
    private createUnitMeasure: CreateUnitMeasureUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateUnitMeasureDTO,
  ) {
    const { name, acronym } = body

    const result = await this.createUnitMeasure.execute({
      content: name,
      acronym,
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

    return { unit_measure: UnitMeasurePresenter.toHTTP(result.value.unitMeasure) }
  }
}
