import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TherapeuticClassesRepository } from '../../../repositories/therapeutic-classes-repository'
import type { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'

interface FetchTherapeuticClassesUseCaseRequest {
  page: number
}

type FetchTherapeuticClassesUseCaseResponse = Either<
  null,
  {
    therapeuticClasses: TherapeuticClass[]
  }
>

@Injectable()
export class FetchTherapeuticClassesUseCase {
  constructor(private therapeuticClassesRepository: TherapeuticClassesRepository) {}

  async execute({
    page,
  }: FetchTherapeuticClassesUseCaseRequest): Promise<FetchTherapeuticClassesUseCaseResponse> {
    const therapeuticClasses = await this.therapeuticClassesRepository.findMany({ page })

    return right({
      therapeuticClasses,
    })
  }
}
