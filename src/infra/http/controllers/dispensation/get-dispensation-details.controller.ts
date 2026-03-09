import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiTags } from '@nestjs/swagger'
import { GetDispensationDetailsUseCase } from '@/domain/pharma/application/use-cases/dispensation/get-dispensation-details'
import { DispensationWithMedicinesPresenter } from '../../presenters/dispensation-with-medicines-presenter'

@ApiTags('dispensation')
@Controller('/dispensation')
export class GetDispensationDetailsController {
  constructor(private getDispensationDetails: GetDispensationDetailsUseCase) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getDispensationDetails.execute({
      dispensationId: id,
    })

    if (result.isLeft()) {
      throw new NotFoundException({})
    }

    const { dispensation } = result.value

    return {
      dispensationDetails: {
        ...DispensationWithMedicinesPresenter.toHTTP(dispensation),
        stock: dispensation.stock,
        reverseAt: dispensation.reverseAt,
      },
    }
  }
}
