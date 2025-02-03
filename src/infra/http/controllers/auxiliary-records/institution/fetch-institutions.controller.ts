import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { InstitutionPresenter } from '../../../presenters/institution-presenter'
import { FetchInstitutionsDto } from './dtos/fetch-institutions.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FethInstitutionsUseCase } from '@/domain/pharma/application/use-cases/institution/fetch-institutions'

@ApiTags('institution')
@ApiBearerAuth()
@Controller('/institutions')
export class FetchInstitutionsController {
  constructor(private fetchInstitutions: FethInstitutionsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchInstitutionsDto) {
    const { page, query } = queryParams
    const result = await this.fetchInstitutions.execute({
      page,
      content: query,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { institutions, meta } = result.value

    return {
      institutions: institutions.map(InstitutionPresenter.toHTTP),
      meta,
    }
  }
}
