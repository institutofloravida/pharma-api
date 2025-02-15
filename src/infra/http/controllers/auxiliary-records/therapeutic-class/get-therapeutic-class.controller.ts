import {
  BadRequestException,
  Controller,
  Get,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetTherapeuticClassUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/therapeutic-class/get-therapeutic-class'
import { TherapeuticClassPresenter } from '@/infra/http/presenters/therapeutic-class-presenter'

@ApiTags('therapeuticclass')
@ApiBearerAuth()
@Controller('/therapeutic-class')
export class GetTherapeuticClassController {
  constructor(private getTherapeuticClass: GetTherapeuticClassUseCase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getTherapeuticClass.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const therapeuticclass = result.value

    return {
      therapeuticclass: TherapeuticClassPresenter.toHTTP(therapeuticclass),
    }
  }
}
