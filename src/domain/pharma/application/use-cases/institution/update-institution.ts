import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Institution } from '@/domain/pharma/enterprise/entities/institution'
import { InstitutionWithSameContentAlreadyExistsError } from './_errors/institution-with-same-content-already-exists-error'
import { InstitutionWithSameCnpjAlreadyExistsError } from './_errors/institution-with-same-cnpj-already-exists-error'
import { InstitutionsRepository } from '../../repositories/institutions-repository'

interface updateInstitutionUseCaseRequest {
  institutionId: string
  content: string,
  cnpj: string,
  description?: string | null,
}

type updateInstitutionUseCaseResponse = Either<
  ResourceNotFoundError | InstitutionWithSameCnpjAlreadyExistsError | InstitutionWithSameContentAlreadyExistsError,
  {
    institution: Institution
  }
>

@Injectable()
export class UpdateInstitutionUseCase {
  constructor(private institutionRepository: InstitutionsRepository) { }
  async execute({ content, institutionId, cnpj, description }: updateInstitutionUseCaseRequest): Promise<updateInstitutionUseCaseResponse> {
    const institution = await this.institutionRepository.findById(institutionId)
    if (!institution) {
      return left(new ResourceNotFoundError())
    }

    const institutionWithSameCnpj = await this.institutionRepository.findByCnpj(cnpj)
    if (institutionWithSameCnpj && institutionWithSameCnpj.cnpj !== cnpj) {
      return left(new InstitutionWithSameCnpjAlreadyExistsError(cnpj))
    }

    const institutionWithSameContent = await this.institutionRepository.findByContent(content)
    if (institutionWithSameContent) {
      return left(new InstitutionWithSameContentAlreadyExistsError(content))
    }

    institution.cnpj = cnpj
    institution.content = content
    institution.description = description

    await this.institutionRepository.save(institution)

    return right({
      institution,
    })
  }
}
