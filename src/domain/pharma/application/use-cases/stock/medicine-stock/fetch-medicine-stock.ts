import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository'
import { MedicineStockDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-stock-details'

interface FetchMedicinesStockUseCaseRequest {
  page: number
  stockId: string
  medicineName?: string
}

type FetchMedicinesStockUseCaseResponse = Either<
  null,
  {
    medicinesStock: MedicineStockDetails[];
    meta: Meta;
  }
>

@Injectable()
export class FetchMedicinesStockUseCase {
  constructor(private medicineStockRepository: MedicinesStockRepository) {}

  async execute({
    page,
    stockId,
    medicineName,
  }: FetchMedicinesStockUseCaseRequest): Promise<FetchMedicinesStockUseCaseResponse> {
    const { medicinesStock, meta } = await this.medicineStockRepository.findMany(
      { page },
      {
        stockId,
        medicineName,
      },
    )

    return right({
      medicinesStock,
      meta,
    })
  }
}
