import { Either, right } from '@/core/either'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { InstitutionsRepository } from '../../repositories/institutions-repository'

interface FetchInstitutionsUseCaseRequest {
  page: number;
  cnpj?: string;
  content?: string;
}

type FetchInstitutionsUseCaseResponse = Either<
  null,
  {
    institutions: Institution[];
    meta: Meta;
  }
>

@Injectable()
export class FethInstitutionsUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({
    page,
    content,
    cnpj,
  }: FetchInstitutionsUseCaseRequest): Promise<FetchInstitutionsUseCaseResponse> {
    const { institutions, meta } = await this.institutionsRepository.findMany(
      { page },
      {
        content,
        cnpj,
      },
    )

    return right({
      institutions,
      meta,
    })
  }
}
