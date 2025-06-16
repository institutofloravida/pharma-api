import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { PatientsRepository } from '../../repositories/patients-repository'

interface GetMetricsUseCaseRequest {
  institutionId: string
}

type GetMetricsUseCaseResponse = Either<
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
    dispense: {
      today: {
        total: number,
        percentageAboveAverage: number
      },
      month: {
        total: number,
        percentageComparedToLastMonth: number
      }
    },
    users: {
      total: number
      receiveMonth: number
    }
  }
>

@Injectable()
export class GetMetricsUseCase {
  constructor(private medicineStockRepository: MedicinesStockRepository,
    private dispensationsRepository: DispensationsMedicinesRepository,
    private patientsRepository: PatientsRepository) {}

  async execute({
    institutionId,
  }: GetMetricsUseCaseRequest): Promise<GetMetricsUseCaseResponse> {
    const inventoryMetrics = await this.medicineStockRepository.getInventoryMetrics(institutionId)
    const dispenseMetrics = await this.dispensationsRepository.getDispensationMetrics(institutionId)
    const usersMetrics = await this.patientsRepository.getPatientsMetrics(institutionId)
    return right({
      inventory: inventoryMetrics,
      dispense: dispenseMetrics,
      users: usersMetrics,
    })
  }
}
