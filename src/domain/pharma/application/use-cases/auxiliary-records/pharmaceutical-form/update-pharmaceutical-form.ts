import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { PharmaceuticalFormsRepository } from '../../../repositories/pharmaceutical-forms-repository'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import { PharmaceuticalFormAlreadyExistsError } from './_errors/pharmaceutical-form-already-exists-error'

interface updatePharmaceuticalFormUseCaseRequest {
  pharmaceuticalformId: string;
  content?: string;
}

type updatePharmaceuticalFormUseCaseResponse = Either<
  ResourceNotFoundError | PharmaceuticalFormAlreadyExistsError,
  {
    pharmaceuticalForm: PharmaceuticalForm;
  }
>

@Injectable()
export class UpdatePharmaceuticalFormUseCase {
  constructor(
    private pharmaceuticalFormsRepository: PharmaceuticalFormsRepository,
  ) {}

  async execute({
    content,
    pharmaceuticalformId,
  }: updatePharmaceuticalFormUseCaseRequest): Promise<updatePharmaceuticalFormUseCaseResponse> {
    const pharmaceuticalForm =
      await this.pharmaceuticalFormsRepository.findById(pharmaceuticalformId)
    if (!pharmaceuticalForm) {
      return left(new ResourceNotFoundError())
    }
    if (content) {
      const pharmaceuticalformWithSameContent =
        await this.pharmaceuticalFormsRepository.findByContent(content)
      if (
        pharmaceuticalformWithSameContent &&
        !pharmaceuticalForm.id.equal(pharmaceuticalformWithSameContent.id)
      ) {
        return left(new PharmaceuticalFormAlreadyExistsError(content))
      }
      pharmaceuticalForm.content = content
    }

    await this.pharmaceuticalFormsRepository.save(pharmaceuticalForm)

    return right({
      pharmaceuticalForm,
    })
  }
}
