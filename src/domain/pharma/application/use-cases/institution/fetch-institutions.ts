import { Either, left, right } from '@/core/either'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { InstitutionsRepository } from '../../repositories/institutions-repository'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { OperatorNotFoundError } from '../operator/_errors/operator-not-found-error'

interface FetchInstitutionsUseCaseRequest {
  page: number;
  cnpj?: string;
  content?: string;
  operatorId: string
}

type FetchInstitutionsUseCaseResponse = Either<
OperatorNotFoundError,
  {
    institutions: Institution[];
    meta: Meta;
  }
>

@Injectable()
export class FethInstitutionsUseCase {
  constructor(private institutionsRepository: InstitutionsRepository, private operatorsRepository: OperatorsRepository) {}

  async execute({
    page,
    content,
    cnpj,
    operatorId,
  }: FetchInstitutionsUseCaseRequest): Promise<FetchInstitutionsUseCaseResponse> {
    const operator = this.operatorsRepository.findById(operatorId)
    if (!operator) {
      return left(new OperatorNotFoundError(operatorId))
    }
    const { institutions, meta } = await this.institutionsRepository.findMany(
      { page },
      {
        content,
        cnpj,
      },
      operatorId,
    )

    return right({
      institutions,
      meta,
    })
  }
}
