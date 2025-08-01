import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InstitutionWithSameContentAlreadyExistsError } from './_errors/institution-with-same-content-already-exists-error'
import { InstitutionWithSameCnpjAlreadyExistsError } from './_errors/institution-with-same-cnpj-already-exists-error'
import { Institution, InstitutionType } from '@/domain/pharma/enterprise/entities/institution'
import { InstitutionsRepository } from '../../repositories/institutions-repository'

interface createInstitutionUseCaseRequest {
  content: string,
  cnpj: string,
  type: InstitutionType,
  responsible: string,
  controlStock: boolean,
  description?: string
}

type createInstitutionUseCaseResponse = Either<
  InstitutionWithSameContentAlreadyExistsError |
  InstitutionWithSameCnpjAlreadyExistsError,
  {
    institution: Institution
  }
>

@Injectable()
export class CreateInstitutionUseCase {
  constructor(private institutionRepository: InstitutionsRepository) { }
  async execute({ content, cnpj, description, responsible, type, controlStock }: createInstitutionUseCaseRequest): Promise<createInstitutionUseCaseResponse> {
    const institution = Institution.create({
      controlStock,
      responsible,
      type,
      content,
      cnpj,
      description,
    })

    const contentExists = await this.institutionRepository.findByContent(content)
    if (contentExists) {
      return left(new InstitutionWithSameContentAlreadyExistsError(content))
    }

    const cnpjExists = await this.institutionRepository.findByCnpj(cnpj)
    if (cnpjExists) {
      return left(new InstitutionWithSameCnpjAlreadyExistsError(cnpj))
    }

    await this.institutionRepository.create(institution)

    return right({
      institution,
    })
  }
}
