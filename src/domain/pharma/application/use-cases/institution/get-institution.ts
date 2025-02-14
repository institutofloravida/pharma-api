import { Either, left, right } from '@/core/either'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { Injectable } from '@nestjs/common'
import { InstitutionsRepository } from '../../repositories/institutions-repository'
import { InstitutionNotFoundError } from './_errors/institution-not-found-error'

interface GetInstitutionUseCaseRequest {
  id: string;
}

type GetInstitutionUseCaseResponse = Either<InstitutionNotFoundError, Institution>

@Injectable()
export class GetInstitutionUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({
    id,
  }: GetInstitutionUseCaseRequest): Promise<GetInstitutionUseCaseResponse> {
    const institution = await this.institutionsRepository.findById(id)

    if (!institution) {
      return left(new InstitutionNotFoundError(id))
    }

    return right(institution)
  }
}
