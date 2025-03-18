import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { TherapeuticClassAlreadyExistsError } from './_errors/therapeutic-class-already-exists-error'
import { TherapeuticClassNotFoundError } from './_errors/therapeutic-class-not-found-error'
import { TherapeuticClassesRepository } from '../../../repositories/therapeutic-classes-repository'

interface updateTherapeuticClassUseCaseRequest {
  therapeuticClassId: string;
  content?: string;
  description?: string;
}

type updateTherapeuticClassUseCaseResponse = Either<
  ResourceNotFoundError | TherapeuticClassAlreadyExistsError,
  null
>

@Injectable()
export class UpdateTherapeuticClassUseCase {
  constructor(private therapeuticClassRepository: TherapeuticClassesRepository) {}
  async execute({
    therapeuticClassId,
    content,
    description,
  }: updateTherapeuticClassUseCaseRequest): Promise<updateTherapeuticClassUseCaseResponse> {
    const therapeuticClass = await this.therapeuticClassRepository.findById(therapeuticClassId)
    if (!therapeuticClass) {
      return left(new TherapeuticClassNotFoundError(therapeuticClassId))
    }

    if (content) {
      const therapeuticClassWithSameContent =
        await this.therapeuticClassRepository.findByContent(content)
      if (
        therapeuticClassWithSameContent &&
        !therapeuticClass.id.equal(therapeuticClassWithSameContent.id)
      ) {
        return left(new TherapeuticClassAlreadyExistsError(content))
      }
      therapeuticClass.content = content
    }
    if (description) {
      therapeuticClass.description = description
    }

    await this.therapeuticClassRepository.save(therapeuticClass)

    return right(null)
  }
}
