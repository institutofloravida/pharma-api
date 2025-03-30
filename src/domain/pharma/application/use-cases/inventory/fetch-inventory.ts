import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'

interface FetchMedicineStockInventoryUseCaseRequest {
  institutionId: string
  stockId?: string
  medicineName?: string
  therapeuticClasses?: string[]
  isCloseToExpiring?: boolean
  isLowStock?: boolean
  page: number
}

type FetchMedicineStockInventoryUseCaseResponse = Either<
  null,
  {
    inventory: MedicineStockInventory[];
    meta: Meta;
  }
>

@Injectable()
export class FetchInventoryUseCase {
  constructor(private medicineStockRepository: MedicinesStockRepository) {}

  async execute({
    page,
    stockId,
    medicineName,
    institutionId,
    isCloseToExpiring,
    isLowStock,
    therapeuticClasses,
  }: FetchMedicineStockInventoryUseCaseRequest): Promise<FetchMedicineStockInventoryUseCaseResponse> {
    const { inventory, meta } = await this.medicineStockRepository.fetchInventory(
      { page },
      institutionId,
      {
        stockId,
        medicineName,
        isCloseToExpiring,
        isLowStock,
        therapeuticClasses,
      },
    )

    return right({
      inventory,
      meta,
    })
  }
}
