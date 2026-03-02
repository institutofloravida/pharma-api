import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'

interface GetInventoryAlertsUseCaseRequest {
  institutionId: string
}

type GetInventoryAlertsUseCaseResponse = Either<
  null,
  {
    expiringBatches: Array<{
      medicineStockId: string
      medicine: string
      stock: string
      stockId: string
      dosage: string
      pharmaceuticalForm: string
      unitMeasure: string
      complement?: string
      batchCode: string
      expirationDate: Date
      quantity: number
      expirationWarningDays: number
    }>
    lowStockMedicines: Array<{
      medicineStockId: string
      medicine: string
      stock: string
      stockId: string
      currentQuantity: number
      minimumLevel: number
    }>
  }
>

@Injectable()
export class GetInventoryAlertsUseCase {
  constructor(private medicinesStockRepository: MedicinesStockRepository) {}

  async execute({
    institutionId,
  }: GetInventoryAlertsUseCaseRequest): Promise<GetInventoryAlertsUseCaseResponse> {
    const alerts =
      await this.medicinesStockRepository.getInventoryAlerts(institutionId)

    return right(alerts)
  }
}
