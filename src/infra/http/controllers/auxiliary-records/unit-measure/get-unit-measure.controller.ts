import {
  BadRequestException,
  Controller,
  Get,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetUnitMeasureUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/unit-measure/get-unit-measure'
import { UnitMeasurePresenter } from '@/infra/http/presenters/unit-measure-presenter'

@ApiTags('unit-measure')
@ApiBearerAuth()
@Controller('/unit-measure')
export class GetUnitMeasureController {
  constructor(private getUnitMeasure: GetUnitMeasureUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getUnitMeasure.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const unitmeasure = result.value

    return {
      unit_measure: UnitMeasurePresenter.toHTTP(unitmeasure),
    }
  }
}
