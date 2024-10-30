import { Either, right } from '@/core/either'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { InstitutionsRepository } from '../../../repositories/institutions-repository'

interface FetchInstitutionsUseCaseRequest {
  page: number
}

type FetchInstitutionsUseCaseResponse = Either<
  null,
  {
    institutions: Institution[]
  }
>

@Injectable()
export class FethInstitutionsUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({
    page,
  }: FetchInstitutionsUseCaseRequest): Promise<FetchInstitutionsUseCaseResponse> {
    const institutions = await this.institutionsRepository.findMany({ page })

    return right({
      institutions,
    })
  }
}
