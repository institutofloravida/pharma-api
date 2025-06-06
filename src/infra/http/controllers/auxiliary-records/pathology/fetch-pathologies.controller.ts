import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchPathologiesUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pathology/fetch-pathologies'
import { PathologyPresenter } from '@/infra/http/presenters/pathology-presenter'
import { FetchPathologiesDto } from './dtos/fetch-pathologies.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('pathology')
@ApiBearerAuth()
@Controller('/pathologies')
export class FetchpathologiesController {
  constructor(private fetchpathologies: FetchPathologiesUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchPathologiesDto) {
    const { page, query } = queryParams

    const result = await this.fetchpathologies.execute({
      page,
      content: query,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { pathologies, meta } = result.value

    return { pathologies: pathologies.map(PathologyPresenter.toHTTP), meta }
  }
}
