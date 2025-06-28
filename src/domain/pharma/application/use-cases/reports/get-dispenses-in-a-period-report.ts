import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { MetaReport } from '@/core/repositories/meta'
import { DispensationWithPatient } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-patient'

interface GetDispenseInAPeriodUseCaseRequest {
  institutionId: string;
  startDate: Date;
  endDate: Date;
  patientId?: string;
  operatorId?: string;
}

type GetDispenseInAPeriodUseCaseResponse = Either<
  null,
  {
    dispenses: DispensationWithPatient[];
    meta: MetaReport;
  }
>

@Injectable()
export class GetDispenseInAPeriodUseCase {
  constructor(
    private dispensationRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    institutionId,
    endDate,
    startDate,
    patientId,
    operatorId,
  }: GetDispenseInAPeriodUseCaseRequest): Promise<GetDispenseInAPeriodUseCaseResponse> {
    const { dispensations, meta } =
      await this.dispensationRepository.getDispensationsInAPeriod(
        institutionId,
        startDate,
        endDate,
        patientId,
        operatorId,
      )
    return right({
      dispenses: dispensations,
      meta: {
        totalCount: meta.totalCount,
      },
    })
  }
}
