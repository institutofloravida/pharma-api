import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PatientsRepository } from '../../repositories/patients-repository'
import { PatientNotFoundError } from './_erros/patient-not-found-error'
import { PatientDetails } from '@/domain/pharma/enterprise/entities/value-objects/patient-details'

interface GetPatientDetailsUseCaseRequest {
  id: string;
}

type GetPatientDetailsUseCaseResponse = Either<PatientNotFoundError, PatientDetails>

@Injectable()
export class GetPatientDetailsUseCase {
  constructor(private patientsRepository: PatientsRepository) {}

  async execute({
    id,
  }: GetPatientDetailsUseCaseRequest): Promise<GetPatientDetailsUseCaseResponse> {
    const patient = await this.patientsRepository.findByIdWithDetails(id)

    if (!patient) {
      return left(new PatientNotFoundError(id))
    }

    return right(patient)
  }
}
