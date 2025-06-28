import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'

interface GetInventoryMetricsUseCaseRequest {
  institutionId: string
}

type GetInventoryMetricsUseCaseResponse = Either<
  null,
  {
    inventory: {
      quantity: {
        totalCurrent: number,
        available: number,
        unavailable: number,
        zero: number,
        expired: number,
      },
    },
  }
>

@Injectable()
export class GetInventoryMetricsUseCase {
  constructor(private medicineStockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    institutionId,
  }: GetInventoryMetricsUseCaseRequest): Promise<GetInventoryMetricsUseCaseResponse> {
    const inventoryMetrics = await this.medicineStockRepository.getInventoryMetrics(institutionId)
    return right({
      inventory: inventoryMetrics,
    })
  }
}
