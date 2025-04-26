import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient'

interface FetchDispensationsUseCaseRequest {
  page: number;
  patientId?: string;
  dispensationDate?: Date;
}

type FetchDispensationsUseCaseResponse = Either<
  null,
  {
    dispensations: DispensationWithPatient[];
    meta: Meta;
  }
>

@Injectable()
export class FetchDispensationsUseCase {
  constructor(
    private dispensationsRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    page,
    patientId,
    dispensationDate,
  }: FetchDispensationsUseCaseRequest): Promise<FetchDispensationsUseCaseResponse> {
    const { dispensations, meta } = await this.dispensationsRepository.findMany(
      { page },
      { patientId, dispensationDate },
    )

    return right({
      dispensations,
      meta,
    })
  }
}
