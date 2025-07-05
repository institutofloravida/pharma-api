import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetPatientDetailsUseCase } from '@/domain/pharma/application/use-cases/patient/get-patient-details'
import { PatientDetailsPresenter } from '../../presenters/patient-details-presenter'

@ApiTags('patient')
@ApiBearerAuth()
@Controller('/patient')
export class GetPatientDetailsController {
  constructor(private getPatientDetails: GetPatientDetailsUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getPatientDetails.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const patient = result.value

    return {
      patient: PatientDetailsPresenter.toHTTP(patient),
    }
  }
}
