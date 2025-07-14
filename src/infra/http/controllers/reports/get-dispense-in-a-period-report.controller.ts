import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetDispenseInAPeriodUseCase } from '@/domain/pharma/application/use-cases/reports/get-dispenses-in-a-period-report'
import { GetDispenseInAPeriodDto } from './dtos/get-dispense-in-a-period-report.dto'
import { DispensationWithMedicinesPresenter } from '../../presenters/dispensation-with-medicines-presenter'

@ApiTags('reports')
@ApiBearerAuth()
@Controller('/reports/dispenses')
export class GetDispenseInAPeriodController {
  constructor(private GetDispensesInAPeriod: GetDispenseInAPeriodUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: GetDispenseInAPeriodDto) {
    const {
      institutionId,
      startDate,
      endDate,
      operatorId,
      patientId,
    } = queryParams
    const result = await this.GetDispensesInAPeriod.execute({
      institutionId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      operatorId,
      patientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { dispenses, meta } = result.value

    const dispensesMapped = dispenses.map(DispensationWithMedicinesPresenter.toHTTP)
    return {
      dispenses: dispensesMapped,
      meta,
    }
  }
}
