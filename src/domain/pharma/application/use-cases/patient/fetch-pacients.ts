import { Either, right } from '@/core/either'
import { Patient } from '@/domain/pharma/enterprise/entities/patient'
import { Injectable } from '@nestjs/common'
import { PatientsRepository } from '../../repositories/patients-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchPatientsUseCaseRequest {
  page: number;
  content?: string;
  cpf?: string;
  sus?: string;
  birthDate?: Date;
  generalRegistration?: string;
}

type FetchPatientsUseCaseResponse = Either<
  null,
  {
    patients: Patient[];
    meta: Meta;
  }
>

@Injectable()
export class FetchPatientsUseCase {
  constructor(private patientsRepository: PatientsRepository) {}

  async execute({
    page,
    content,
    cpf,
    sus,
    birthDate,
    generalRegistration,
  }: FetchPatientsUseCaseRequest): Promise<FetchPatientsUseCaseResponse> {
    const { patients, meta } = await this.patientsRepository.findMany(
      { page },
      content,
      cpf,
      sus,
      birthDate,
      generalRegistration,
    )

    return right({
      patients,
      meta,
    })
  }
}