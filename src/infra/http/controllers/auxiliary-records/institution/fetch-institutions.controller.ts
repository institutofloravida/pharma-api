import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { FethInstitutionsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/fetch-institutions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { InstitutionPresenter } from '../../../presenters/institution-presenter'
import { FetchInstitutionsDto } from './dtos/fetch-institutions.dto'

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

    const institutions = result.value.institutions

    return { institutions: institutions.map(InstitutionPresenter.toHTTP) }
  }
}
