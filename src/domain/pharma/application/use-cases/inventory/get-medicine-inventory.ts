import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicineStockInventoryDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-inventory-details'

interface GetInventoryMedicineDetailsUseCaseRequest {
  medicineStockId: string
}

type GetInventoryMedicineDetailsUseCaseResponse = Either<
  null,
  {
    medicineStockInventory: MedicineStockInventoryDetails;
  }
>

@Injectable()
export class GetMedicineInventoryDetailsUseCase {
  constructor(private medicineStockRepository: MedicinesStockRepository) {}

  async execute({
    medicineStockId,
  }: GetInventoryMedicineDetailsUseCaseRequest): Promise<GetInventoryMedicineDetailsUseCaseResponse> {
    const medicineStockInventory = await this.medicineStockRepository.getInventoryByMedicineStockId(
      medicineStockId,
    )

    if (!medicineStockInventory) {
      return left(null)
    }

    return right({
      medicineStockInventory,
    })
  }
}
