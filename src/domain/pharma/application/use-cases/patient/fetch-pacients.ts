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
  pathologyId?: string
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
    pathologyId,
  }: FetchPatientsUseCaseRequest): Promise<FetchPatientsUseCaseResponse> {
    const { patients, meta } = await this.patientsRepository.findMany(
      { page },
      {
        birthDate,
        cpf,
        generalRegistration,
        name: content,
        pathologyId,
        sus,
      },
    )

    return right({
      patients,
      meta,
    })
  }
}
