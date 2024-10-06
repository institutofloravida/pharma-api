import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Institution } from '../../enterprise/entities/institution'
import type { InstitutionRepository } from '../repositories/institution-repository'

interface createInstitutionUseCaseRequest {
  content: string,
  cnpj: string
  description?: string
}
type createInstitutionUseCaseResponse = Either<
  ConflictError,
  {
    institution: Institution
  }
>
export class CreateInstitutionUseCase {
  constructor(private institutionRepository: InstitutionRepository) {}
  async execute({ content, cnpj, description }: createInstitutionUseCaseRequest): Promise<createInstitutionUseCaseResponse> {
    const institution = Institution.create({
      content,
      cnpj,
      description,
    })

    const contentExists = await this.institutionRepository.findByContent(content)
    if (contentExists) {
      return left(new ConflictError())
    }

    const cnpjExists = await this.institutionRepository.findByCnpj(cnpj)
    if (cnpjExists) {
      return left(new ConflictError())
    }

    await this.institutionRepository.create(institution)

    return right({
      institution,
    })
  }
}
