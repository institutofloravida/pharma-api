import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchTherapeuticClassesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/fetch-therapeutic-classes'
import { TherapeuticClassPresenter } from '../../../presenters/therapeutic-class-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchTherapeuticClassDto } from './dtos/fetch-therapeutic-class.dto'

@ApiTags('therapeutic-class')
@ApiBearerAuth()
@Controller('/therapeutic-class')
export class FetchTerapeuticClasssController {
  constructor(
    private fetchTherapeuticClasses: FetchTherapeuticClassesUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchTherapeuticClassDto) {
    const { page, query } = queryParams

    const result = await this.fetchTherapeuticClasses.execute({
      page,
      content: query,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { therapeuticClasses, meta } = result.value

    return {
      therapeutic_classes: therapeuticClasses.map(
        TherapeuticClassPresenter.toHTTP,
      ),
      meta,
    }
  }
}
