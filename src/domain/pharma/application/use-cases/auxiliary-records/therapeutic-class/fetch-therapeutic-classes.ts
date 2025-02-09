import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TherapeuticClassesRepository } from '../../../repositories/therapeutic-classes-repository'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { Meta } from '@/core/repositories/meta'

interface FetchTherapeuticClassesUseCaseRequest {
  page: number
  content?: string
}

type FetchTherapeuticClassesUseCaseResponse = Either<
  null,
  {
    therapeuticClasses: TherapeuticClass[]
    meta: Meta
  }
>

@Injectable()
export class FetchTherapeuticClassesUseCase {
  constructor(private therapeuticClassesRepository: TherapeuticClassesRepository) {}

  async execute({
    page,
    content,
  }: FetchTherapeuticClassesUseCaseRequest): Promise<FetchTherapeuticClassesUseCaseResponse> {
    const { therapeuticClasses, meta } = await this.therapeuticClassesRepository.findMany({ page }, { content })

    return right({
      therapeuticClasses,
      meta,
    })
  }
}
