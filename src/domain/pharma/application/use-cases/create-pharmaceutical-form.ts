import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { PharmaceuticalForm } from '../../enterprise/entities/pharmaceutical-form'
import type { PharmaceuticalFormsRepository } from '../repositories/pharmaceutical-forms-repository'

interface createPharmaceuticalFormUseCaseRequest {
  content: string
}
type createPharmaceuticalFormUseCaseResponse = Either<
  ConflictError,
  {
    pharmaceuticalForm: PharmaceuticalForm
  }
>
export class CreatePharmaceuticalFormUseCase {
  constructor(private pharmaceuticalFormRepository: PharmaceuticalFormsRepository) {}
  async execute({ content }: createPharmaceuticalFormUseCaseRequest): Promise<createPharmaceuticalFormUseCaseResponse> {
    const pharmaceuticalForm = PharmaceuticalForm.create({
      content,
    })

    const contentExists = await this.pharmaceuticalFormRepository.findByContent(content)
    if (contentExists) {
      return left(new ConflictError())
    }

    await this.pharmaceuticalFormRepository.create(pharmaceuticalForm)

    return right({
      pharmaceuticalForm,
    })
  }
}
