import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'
import { Meta } from '@/core/repositories/meta'

interface FetchPathologiesUseCaseRequest {
  page: number
  content?: string
}

type FetchPathologiesUseCaseResponse = Either<
  null,
  {
    pathologies: Pathology[]
    meta: Meta
  }
>

@Injectable()
export class FetchPathologiesUseCase {
  constructor(private PathologiesRepository: PathologiesRepository) {}

  async execute({
    page,
    content,
  }: FetchPathologiesUseCaseRequest): Promise<FetchPathologiesUseCaseResponse> {
    const { pathologies, meta } = await this.PathologiesRepository.findMany({ page }, content)

    return right({
      pathologies,
      meta,
    })
  }
}
