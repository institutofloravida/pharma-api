import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchMovementTypesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/movement-type/fetch-movement-type'
import { FetchMovementTypesDto } from './dtos/fetch-movement-types.dto'
import { MovementTypePresenter } from '@/infra/http/presenters/movement-type-presenter'

@ApiTags('movement-type')
@ApiBearerAuth()
@Controller('/movement-type')
export class FetchmovementTypesController {
  constructor(private fetchmovementtypes: FetchMovementTypesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchMovementTypesDto) {
    const { page, query, direction } = queryParams

    const result = await this.fetchmovementtypes.execute({
      page,
      content: query,
      direction,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { movementTypes, meta } = result.value

    return {
      movement_types: movementTypes.map(MovementTypePresenter.toHTTP),
      meta,
    }
  }
}
