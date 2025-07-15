import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MetaReport } from '@/core/repositories/meta'
import { UseMedicine } from '@/domain/pharma/enterprise/use-medicine'
import { UseMedicinesRepository } from '../../repositories/use-medicine-repository'

interface GetMonthlyMedicineUtilizationUseCaseRequest {
  institutionId: string;
  year: number;
  month: number;
  stockId?: string;
}

type GetMonthlyMedicineUtilizationUseCaseResponse = Either<
  null,
  {
    utilization: UseMedicine[];
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

    return right({
      utilization,
      totalUtilization,
      meta: {
        totalCount: meta.totalCount,
      },
    })
  }
}
