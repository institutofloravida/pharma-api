import { Either, left, right } from '@/core/either'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'
import { PathologyNotFoundError } from './_erros/pathology-not-found-error'

interface GetPathologyUseCaseRequest {
  id: string;
}

type GetPathologyUseCaseResponse = Either<PathologyNotFoundError, Pathology>

@Injectable()
export class GetPathologyUseCase {
  constructor(private pathologiesRepository: PathologiesRepository) {}

  async execute({
    id,
  }: GetPathologyUseCaseRequest): Promise<GetPathologyUseCaseResponse> {
    const pathology = await this.pathologiesRepository.findById(id)

    if (!pathology) {
      return left(new PathologyNotFoundError(id))
    }

    return right(pathology)
  }
}
