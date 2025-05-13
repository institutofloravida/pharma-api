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
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

@ApiTags('institution')
@ApiBearerAuth()
@Controller('/institutions')
export class FetchInstitutionsController {
  constructor(private fetchInstitutions: FethInstitutionsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@CurrentUser() user: UserPayload, @Query() queryParams: FetchInstitutionsDto) {
    const { page, query, cnpj } = queryParams
    const result = await this.fetchInstitutions.execute({
      page,
      content: query,
      cnpj,
      operatorId: user.sub,
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
