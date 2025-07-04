import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdatePatientUseCase } from '@/domain/pharma/application/use-cases/patient/update-patient'
import { PatientPresenter } from '../../presenters/patient-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UpdatePatientDto } from './dtos/update-patient.dto'

@ApiTags('patient')
@ApiBearerAuth()
@Controller('/patient')
@UseGuards(JwtAuthGuard)
export class UpdatePatientController {
  constructor(private updatePatient: UpdatePatientUseCase) {}

  @Put(':id')
  @HttpCode(200)
  async handle(@Param('id') patientId: string, @Body() body: UpdatePatientDto) {
    const {
      name,
      addressPatient,
      birthDate,
      cpf,
      gender,
      pathologiesIds,
      race,
      sus,
      generalRegistration,
    } = body

    const result = await this.updatePatient.execute({
      addressPatient,
      birthDate,
      gender,
      name,
      pathologiesIds,
      patientId,
      race,
      sus,
      cpf: cpf ?? undefined,
      generalRegistration,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { patient: PatientPresenter.toHTTP(result.value.patient) }
  }
}
