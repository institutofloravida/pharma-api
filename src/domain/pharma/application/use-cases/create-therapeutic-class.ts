import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { TherapeuticClass } from '../../enterprise/entities/therapeutic-class'
import type { TherapeuticClassRepository } from '../repositories/therapeutic-class-repository'

interface createTherapeuticClassUseCaseRequest {
  content: string
}
type createTherapeuticClassUseCaseResponse = Either<
  ConflictError,
  {
    therapeuticClass: TherapeuticClass
  }
>
export class CreateTherapeuticClassUseCase {
  constructor(private therapeuticClassRepository: TherapeuticClassRepository) {}
  async execute({ content }: createTherapeuticClassUseCaseRequest): Promise<createTherapeuticClassUseCaseResponse> {
    const therapeuticClass = TherapeuticClass.create({
      content,
    })

    const contentExists = await this.therapeuticClassRepository.findByContent(content)
    if (contentExists) {
      return left(new ConflictError())
    }

    await this.therapeuticClassRepository.create(therapeuticClass)

    return right({
      therapeuticClass,
    })
  }
}
