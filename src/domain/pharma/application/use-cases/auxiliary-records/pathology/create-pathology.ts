import { left, right, type Either } from '@/core/either'
import { Pathology } from '../../../../enterprise/entities/pathology'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'
import { PathologyAlreadyExistsError } from './_erros/pathology-already-exists-error'

interface createPathologyUseCaseRequest {
  content: string,
  code: string,
}

type createPathologyUseCaseResponse = Either<
 PathologyAlreadyExistsError,
  {
    pathology: Pathology
  }
>

@Injectable()
export class CreatePathologyUseCase {
  constructor(private pathologyRepository: PathologiesRepository) {}
  async execute({ content, code }: createPathologyUseCaseRequest): Promise<createPathologyUseCaseResponse> {
    const codeExists = await this.pathologyRepository.findByCode(code)
    if (codeExists) {
      return left(new PathologyAlreadyExistsError(code))
    }

    const contentExists = await this.pathologyRepository.findByContent(content)
    if (contentExists) {
      return left(new PathologyAlreadyExistsError(content))
    }

    const pathology = Pathology.create({
      content,
      code,
    })

    await this.pathologyRepository.create(pathology)

    return right({
      pathology,
    })
  }
}
