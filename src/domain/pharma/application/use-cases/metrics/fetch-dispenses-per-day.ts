import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { type MetaReport } from '@/core/repositories/meta'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { type DispensationPerDay } from '@/domain/pharma/enterprise/entities/dispensation'

interface FetchDispensesPerDayUseCaseRequest {
  institutionId: string;
  startDate: Date;
  endDate: Date;
}

type FetchDispensesPerDayUseCaseResponse = Either<
  null,
  {
    dispenses: DispensationPerDay[];
    meta: MetaReport;
  }
>

@Injectable()
export class FetchDispensesPerDayUseCase {
  constructor(
    private dispensationsRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    institutionId,
    startDate,
    endDate,
  }: FetchDispensesPerDayUseCaseRequest): Promise<FetchDispensesPerDayUseCaseResponse> {
    const { dispenses, meta } = await this.dispensationsRepository.fetchDispensesPerDay(
      institutionId,
      startDate,
      endDate,
    )

    return right({
      dispenses,
      meta,
    })
  }
}
