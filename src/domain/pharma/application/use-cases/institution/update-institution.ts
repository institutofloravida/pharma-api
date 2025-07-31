import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Institution, type InstitutionType } from '@/domain/pharma/enterprise/entities/institution'
import { InstitutionWithSameContentAlreadyExistsError } from './_errors/institution-with-same-content-already-exists-error'
import { InstitutionWithSameCnpjAlreadyExistsError } from './_errors/institution-with-same-cnpj-already-exists-error'
import { InstitutionsRepository } from '../../repositories/institutions-repository'

interface updateInstitutionUseCaseRequest {
  institutionId: string
  content: string,
  cnpj: string,
  responsible: string,
  controlStock: boolean,
  type: InstitutionType,
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
  async execute({ content, institutionId, cnpj, description, controlStock, responsible, type }: updateInstitutionUseCaseRequest): Promise<updateInstitutionUseCaseResponse> {
    const institution = await this.institutionRepository.findById(institutionId)
    if (!institution) {
      return left(new ResourceNotFoundError())
    }
    if (cnpj) {
      const institutionWithSameCnpj = await this.institutionRepository.findByCnpj(cnpj)
      if (institutionWithSameCnpj && institutionWithSameCnpj.id.toString() !== institutionId) {
        return left(new InstitutionWithSameCnpjAlreadyExistsError(cnpj))
      }
      institution.cnpj = cnpj
    }

    if (content) {
      const institutionWithSameContent = await this.institutionRepository.findByContent(content)
      if (institutionWithSameContent && institutionWithSameContent.id.toString() !== institutionId) {
        return left(new InstitutionWithSameContentAlreadyExistsError(content))
      }
      institution.content = content
    }

    const institutionUpdated = Institution.create({
      updatedAt: new Date(),
      createdAt: institution.createdAt,
      cnpj,
      content,
      description: description ?? institution.description,
      responsible,
      controlStock,
      type,
    }, institution.id)

    await this.institutionRepository.save(institutionUpdated)

    return right({
      institution: institutionUpdated,
    })
  }
}
