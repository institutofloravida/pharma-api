import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { MostTreatedPathology } from '@/domain/pharma/enterprise/entities/pathology'

interface FetchMostTreatedPathologiesUseCaseRequest {
  institutionId?: string;
}

type FetchMostTreatedPathologiesUseCaseResponse = Either<
  null,
  {
    mostTreatedPathologies: MostTreatedPathology[];
  }
>

@Injectable()
export class FetchMostTreatedPathologiesUseCase {
  constructor(
    private dispensationsRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    institutionId,
  }: FetchMostTreatedPathologiesUseCaseRequest): Promise<FetchMostTreatedPathologiesUseCaseResponse> {
    const { mostTreatedPathologies } = await this.dispensationsRepository.fetchMostTreatedPathologies(
      institutionId,
    )

    return right({
      mostTreatedPathologies,
    })
  }
}
