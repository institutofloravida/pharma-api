import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreatePatientDto } from './dtos/create-patient.dto'
import { CreatePatientUseCase } from '@/domain/pharma/application/use-cases/patient/create-patient'
import { PatientPresenter } from '../../presenters/patient-presenter'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Race } from 'prisma/generated/prisma'

@ApiTags('patient')
@ApiBearerAuth()
@Controller('/patient')
@UseGuards(JwtAuthGuard)
export class CreatePatientController {
  constructor(private createPatient: CreatePatientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreatePatientDto) {
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

    const result = await this.createPatient.execute({
      addressPatient,
      birthDate,
      cpf,
      gender,
      name,
      pathologiesIds,
      race: Race[race],
      sus,
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
