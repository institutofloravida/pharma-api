import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'

interface GetDispenseMetricsUseCaseRequest {
  institutionId: string;
}

type GetDispenseMetricsUseCaseResponse = Either<
  null,
  {
    dispense: {
      today: {
        total: number;
        percentageAboveAverage: number;
      };
      month: {
        total: number;
        percentageComparedToLastMonth: number;
      };
    };
  }
>

@Injectable()
export class GetDispenseMetricsUseCase {
  constructor(
    private dispensationsRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    institutionId,
  }: GetDispenseMetricsUseCaseRequest): Promise<GetDispenseMetricsUseCaseResponse> {
    const dispenseMetrics =
      await this.dispensationsRepository.getDispensationMetrics(institutionId)

    return right({
      dispense: dispenseMetrics,
    })
  }
}
