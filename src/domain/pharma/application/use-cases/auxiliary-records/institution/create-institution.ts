import { left, right, type Either } from '@/core/either'
import { Institution } from '../../../../enterprise/entities/institution'
import { InstitutionsRepository } from '../../../repositories/institutions-repository'
import { Injectable } from '@nestjs/common'
import { InstitutionWithSameContentAlreadyExistsError } from './_errors/institution-with-same-content-already-exists-error'
import { InstitutionWithSameCnpjAlreadyExistsError } from './_errors/institution-with-same-cnpj-already-exists-error'

interface createInstitutionUseCaseRequest {
  content: string,
  cnpj: string
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
  async execute({ content, cnpj, description }: createInstitutionUseCaseRequest): Promise<createInstitutionUseCaseResponse> {
    const institution = Institution.create({
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
