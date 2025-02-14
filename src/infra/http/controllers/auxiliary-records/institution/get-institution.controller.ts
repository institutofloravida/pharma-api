import {
  BadRequestException,
  Controller,
  Get,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { InstitutionPresenter } from '../../../presenters/institution-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetInstitutionUseCase } from '@/domain/pharma/application/use-cases/institution/get-institution'

@ApiTags('institution')
@ApiBearerAuth()
@Controller('/institution')
export class GetInstitutionController {
  constructor(private getInstitution: GetInstitutionUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getInstitution.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const institution = result.value

    return {
      institution: InstitutionPresenter.toHTTP(institution),
    }
  }
}
