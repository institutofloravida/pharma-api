import { left, right, type Either } from '@/core/either'
import { Pathology } from '../../../../enterprise/entities/pathology'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { PathologyAlreadyExistsError } from './_erros/pathology-already-exists-error'

interface updatePathologyUseCaseRequest {
  pathologyId: string;
  content?: string;
  code?: string;
}

type updatePathologyUseCaseResponse = Either<
  ResourceNotFoundError | PathologyAlreadyExistsError,
  {
    pathology: Pathology;
  }
>

@Injectable()
export class UpdatePathologyUseCase {
  constructor(private pathologyRepository: PathologiesRepository) {}
  async execute({
    content,
    code,
    pathologyId,
  }: updatePathologyUseCaseRequest): Promise<updatePathologyUseCaseResponse> {
    const pathology = await this.pathologyRepository.findById(pathologyId)
    if (!pathology) {
      return left(new ResourceNotFoundError())
    }

    if (code) {
      const pathologyWithSameCode =
        await this.pathologyRepository.findByCode(code)
      if (
        pathologyWithSameCode &&
        !pathology.id.equal(pathologyWithSameCode.id)
      ) {
        return left(new PathologyAlreadyExistsError(code))
      }
      pathology.code = code
    }

    if (content) {
      const pathologyWithSameContent =
        await this.pathologyRepository.findByContent(content)
      if (
        pathologyWithSameContent &&
        !pathology.id.equal(pathologyWithSameContent.id)
      ) {
        return left(new PathologyAlreadyExistsError(content))
      }
      pathology.content = content
    }

    await this.pathologyRepository.save(pathology)

    return right({
      pathology,
    })
  }
}
