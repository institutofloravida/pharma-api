import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Pathology } from '../../../../enterprise/entities/pathology'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'

interface createPathologyUseCaseRequest {
  content: string,
}

type createPathologyUseCaseResponse = Either<
  ConflictError,
  {
    pathology: Pathology
  }
>

@Injectable()
export class CreatePathologyUseCase {
  constructor(private pathologyRepository: PathologiesRepository) {}
  async execute({ content }: createPathologyUseCaseRequest): Promise<createPathologyUseCaseResponse> {
    const pathology = Pathology.create({
      content,
    })

    const contentExists = await this.pathologyRepository.findByContent(content)
    if (contentExists) {
      return left(new ConflictError())
    }

    await this.pathologyRepository.create(pathology)

    return right({
      pathology,
    })
  }
}
