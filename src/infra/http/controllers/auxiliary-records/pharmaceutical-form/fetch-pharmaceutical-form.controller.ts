import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchPharmaceuticalFormsUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { PharmaceuticalFormPresenter } from '../../../presenters/pharmaceutical-form-presenter'
import { FetchPharmaceuticalFormDto } from './dtos/fetch-pharmaceutical-form.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('pharmaceutical-form')
@ApiBearerAuth()
@Controller('/pharmaceutical-form')
export class FetchPharmaceuticalFormController {
  constructor(private fetchPharmaceuticalForms: FetchPharmaceuticalFormsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchPharmaceuticalFormDto) {
    const { page, query } = queryParams
    const result = await this.fetchPharmaceuticalForms.execute({
      page,
      content: query,
    })
    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { pharmaceuticalForms, meta } = result.value

    return { pharmaceutical_forms: pharmaceuticalForms.map(PharmaceuticalFormPresenter.toHTTP), meta }
  }
}
