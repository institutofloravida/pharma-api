import { Either, right } from '@/core/either'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { InstitutionsRepository } from '../../../repositories/institutions-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchInstitutionsUseCaseRequest {
  page: number
  content?: string
}

type FetchInstitutionsUseCaseResponse = Either<
  null,
  {
    institutions: Institution[],
    meta: Meta
  }
>

@Injectable()
export class FethInstitutionsUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({
    page,
    content,
  }: FetchInstitutionsUseCaseRequest): Promise<FetchInstitutionsUseCaseResponse> {
    const { institutions, meta } = await this.institutionsRepository.findMany({ page }, content)

    return right({
      institutions,
      meta,
    })
  }
}
