import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FetchPatientsDto } from './dtos/fetch-patients.dto'
import { FetchPatientsUseCase } from '@/domain/pharma/application/use-cases/patient/fetch-pacients'
import { PatientPresenter } from '../../presenters/patient-presenter'

@ApiTags('patient')
@ApiBearerAuth()
@Controller('/patients')
export class FetchPatientsController {
  constructor(private fetchPatients: FetchPatientsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchPatientsDto) {
    const {
      page,
      name,
      birthDate,
      cpf,
      generalRegistration,
      sus,
    } = queryParams

    const result = await this.fetchPatients.execute({
      page,
      content: name,
      birthDate,
      cpf,
      generalRegistration,
      sus,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const { patients, meta } = result.value

    return {
      patients: patients.map(PatientPresenter.toHTTP),
      meta: {
        totalCount: meta.totalCount,
        page: meta.page,
      },
    }
  }
}
