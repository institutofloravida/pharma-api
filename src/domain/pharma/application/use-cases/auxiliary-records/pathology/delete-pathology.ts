import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { PatientsRepository } from '../../../repositories/patients-repository'
import { PathologyHasDependencyError } from './_erros/pathology-has-dependency-error'

interface deletePathologyUseCaseRequest {
  pathologyId: string
}

type deletePathologyUseCaseResponse = Either<
  ResourceNotFoundError | PathologyHasDependencyError,
  null
>

@Injectable()
export class DeletePathologyUseCase {
  constructor(private pathologyRepository: PathologiesRepository,
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({ pathologyId }: deletePathologyUseCaseRequest): Promise<deletePathologyUseCaseResponse> {
    const pathology = await this.pathologyRepository.findById(pathologyId)
    if (!pathology) {
      return left(new ResourceNotFoundError())
    }

    const {
      meta,
    } = await this.patientsRepository.findMany({ page: 1 }, { pathologyId })
    const pathologyHasDependency = meta.totalCount
    if (pathologyHasDependency > 0) {
      return left(new PathologyHasDependencyError())
    }

    await this.pathologyRepository.delete(pathology)

    return right(null)
  }
}
