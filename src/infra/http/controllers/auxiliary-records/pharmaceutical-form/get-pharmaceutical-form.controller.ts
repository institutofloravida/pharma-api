import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetPharmaceuticalFormUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/pharmaceutical-form/get-pharmaceutical-form'
import { PharmaceuticalFormPresenter } from '@/infra/http/presenters/pharmaceutical-form-presenter'

@ApiTags('pharmaceutical-form')
@ApiBearerAuth()
@Controller('/pharmaceutical-form')
export class GetPharmaceuticalFormController {
  constructor(private getPharmaceuticalForm: GetPharmaceuticalFormUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getPharmaceuticalForm.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const pharmaceuticalform = result.value

    return {
      pharmaceutical_form:
        PharmaceuticalFormPresenter.toHTTP(pharmaceuticalform),
    }
  }
}
