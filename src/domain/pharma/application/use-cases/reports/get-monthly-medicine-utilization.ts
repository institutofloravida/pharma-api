import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MetaReport } from '@/core/repositories/meta'
import { UseMedicinesRepository } from '../../repositories/use-medicine-repository'
import { UseMedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/use-medicine-details'

interface GetMonthlyMedicineUtilizationUseCaseRequest {
  institutionId: string;
  year: number;
  month: number;
  stockId?: string;
}

type GetMonthlyMedicineUtilizationUseCaseResponse = Either<
  null,
  {
    utilization: UseMedicineDetails[];
    totalUtilization: number;
    meta: MetaReport;
  }
>

@Injectable()
export class GetMonthlyMedicineUtilizationUseCase {
  constructor(private useMedicinesRepository: UseMedicinesRepository) {}

  async execute({
    institutionId,
    month,
    year,
    stockId,
  }: GetMonthlyMedicineUtilizationUseCaseRequest): Promise<GetMonthlyMedicineUtilizationUseCaseResponse> {
    const { utilization, totalUtilization, meta } =
      await this.useMedicinesRepository.fetchMonthlyMedicinesUtilization({
        institutionId,
        month,
        year,
        stockId,
      })
    console.log('use case: ', utilization)

    return right({
      utilization,
      totalUtilization,
      meta: {
        totalCount: meta.totalCount,
      },
    })
  }
}
