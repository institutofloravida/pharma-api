import { left, right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStock } from '../../../enterprise/entities/medicine-stock'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { StocksRepository } from '../../repositories/stocks-repository'
import { Batchestock } from '../../../enterprise/entities/batch-stock'
import { BatchesRepository } from '../../repositories/batches-repository'
import { Batch } from '../../../enterprise/entities/batch'
import { BatchestocksRepository } from '../../repositories/batch-stocks-repository'
import { MedicineStockAlreadyExistsError } from '../_errors/medicine-stock-already-exists-error'
import { Injectable } from '@nestjs/common'

interface createMedicineStockUseCaseRequest {
  medicineId: string,
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
    private medicineRepository: MedicinesRepository,
    private batchRepository: BatchesRepository,
    private batchestockRepository: BatchestocksRepository,
    private medicinestockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    medicineId,
    stockId,
    quantity,
    code,
    expirationDate,
    manufacturerId,
    manufacturingDate,

  }: createMedicineStockUseCaseRequest): Promise<createMedicineStockUseCaseResponse> {
    const [medicine, stock] = await Promise.all([
      this.medicineRepository.findById(medicineId),
      this.stockRepository.findById(stockId),
    ])

    if (!medicine || !stock) {
      return left(new ResourceNotFoundError())
    }

    const batch = Batch.create({
      code,
      expirationDate,
      manufacturerId: new UniqueEntityId(manufacturerId),
      manufacturingDate,
    })

    const batchestock = Batchestock.create({
      medicineId: new UniqueEntityId(medicineId),
      batchId: batch.id,
      currentQuantity: quantity,
      stockId: new UniqueEntityId(stockId),
      lastMove: new Date(),
    })

    const medicineStock = MedicineStock.create({
      medicineId: new UniqueEntityId(medicineId),
      stockId: new UniqueEntityId(stockId),
      currentQuantity: quantity,
      batchesStockIds: [batchestock.id.toString()],
    })

    const medicineStockExists = await this.medicinestockRepository.medicineStockExists(medicineStock)

    if (medicineStockExists) {
      return left(new MedicineStockAlreadyExistsError(medicineStockExists.id.toString()))
    }

    await Promise.all([
      this.batchRepository.create(batch),
      this.batchestockRepository.create(batchestock),
      this.medicinestockRepository.create(medicineStock),
    ])

    return right({
      medicineStock,
    })
  }
}
