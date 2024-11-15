import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PathologiesRepository } from '../../../repositories/pathologies-repository'
import { Pathology } from '@/domain/pharma/enterprise/entities/pathology'

interface FetchPathologiesUseCaseRequest {
  page: number
}

type FetchPathologiesUseCaseResponse = Either<
  null,
  {
    pathologies: Pathology[]
  }
>

@Injectable()
export class FetchPathologiesUseCase {
  constructor(private PathologiesRepository: PathologiesRepository) {}

  async execute({
    page,
  }: FetchPathologiesUseCaseRequest): Promise<FetchPathologiesUseCaseResponse> {
    const pathologies = await this.PathologiesRepository.findMany({ page })

    return right({
      pathologies,
    })
  }
}
