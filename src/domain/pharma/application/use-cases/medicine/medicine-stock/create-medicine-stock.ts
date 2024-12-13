import { left, right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStock } from '../../../../enterprise/entities/medicine-stock'
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { Batch } from '../../../../enterprise/entities/batch'
import { MedicineStockAlreadyExistsError } from '../../_errors/medicine-stock-already-exists-error'
import { Injectable } from '@nestjs/common'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import  { BatchStocksRepository } from '../../../repositories/batch-stocks-repository'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

interface createMedicineStockUseCaseRequest {
  medicineVariantId: string,
  stockId: string
  quantity: number
  code: string
  expirationDate: Date,
  manufacturerId: string,
  manufacturingDate?: Date,
}

type createMedicineStockUseCaseResponse = Either<
  ResourceNotFoundError | MedicineStockAlreadyExistsError,
  {
    medicineStock: MedicineStock
  }
>

@Injectable()
export class CreateMedicineStockUseCase {
  constructor(
    private stockRepository: StocksRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,

    private batchRepository: BatchesRepository,
    private batcheStockRepository: BatchStocksRepository,
    private medicineStockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    medicineVariantId,
    stockId,
    quantity,
    code,
    expirationDate,
    manufacturerId,
    manufacturingDate,

  }: createMedicineStockUseCaseRequest): Promise<createMedicineStockUseCaseResponse> {
    const [medicineVariant, stock] = await Promise.all([
      this.medicinesVariantsRepository.findById(medicineVariantId),
      this.stockRepository.findById(stockId),
    ])

    if (!medicineVariant || !stock) {
      return left(new ResourceNotFoundError())
    }

    const batch = Batch.create({
      code,
      expirationDate,
      manufacturerId: new UniqueEntityId(manufacturerId),
      manufacturingDate,
    })

    const batchestock = BatchStock.create({
      medicineVariantId: new UniqueEntityId(medicineVariantId),
      batchId: batch.id,
      currentQuantity: quantity,
      stockId: new UniqueEntityId(stockId),
      lastMove: new Date(),
    })

    const medicineStock = MedicineStock.create({
      medicineVariantId: new UniqueEntityId(medicineVariantId),
      stockId: new UniqueEntityId(stockId),
      currentQuantity: quantity,
      batchesStockIds: [batchestock.id],
    })

    const medicineStockExists = await this.medicineStockRepository.medicineStockExists(medicineStock)

    if (medicineStockExists) {
      return left(new MedicineStockAlreadyExistsError(medicineStockExists.id.toString()))
    }

    await Promise.all([
      this.batchRepository.create(batch),
      this.batcheStockRepository.create(batchestock),
      this.medicineStockRepository.create(medicineStock),
    ])

    return right({
      medicineStock,
    })
  }
}
