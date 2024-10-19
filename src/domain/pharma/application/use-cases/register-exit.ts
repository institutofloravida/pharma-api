import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import type { MedicinesStockRepository } from '../repositories/medicines-stock-repository'
import type { MedicinesRepository } from '../repositories/medicines-repository'
import type { BatchStocksRepository } from '../repositories/batch-stocks-repository'
import type { BatchsRepository } from '../repositories/batchs-repository'
import { NoBatchInStockFoundError } from './_errors/no-batch-in-stock-found-error'
import { MedicineExit, type ExitType } from '../../enterprise/entities/exit'
import type { MedicinesExitsRepository } from '../repositories/medicines-exits-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidExitQuantityError } from './_errors/invalid-exit-quantity-error'
import { InsufficientQuantityBatchInStockError } from './_errors/insufficient-quantity-batch-in-stock-error'

interface RegisterExitUseCaseRequest {
  medicineId: string
  stockId: string
  operatorId: string
  batcheStockId: string
  quantity: number
  exitType: ExitType
  exitDate?: Date
}

type RegisterExitUseCaseResponse = Either<
  ResourceNotFoundError | NoBatchInStockFoundError,
  null
>
export class RegisterExitUseCase {
  constructor(
    private medicineExitRepository: MedicinesExitsRepository,
    private medicinesRepository: MedicinesRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchStockskRepository: BatchStocksRepository,
    private batchsRepository: BatchsRepository,
  ) {}

  async execute({
    medicineId,
    stockId,
    operatorId,
    batcheStockId,
    quantity,
    exitDate,
    exitType,
  }: RegisterExitUseCaseRequest): Promise<RegisterExitUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(medicineId)
    if (!medicine) {
      return left(new ResourceNotFoundError())
    }

    const medicineStock = await this.medicinesStockRepository.findByMedicineIdAndStockId(medicineId, stockId)
    if (!medicineStock) {
      return left(new NoBatchInStockFoundError(medicine.content))
    }

    const batchStock = await this.batchStockskRepository.findById(batcheStockId)
    if (!batchStock) {
      return left(new ResourceNotFoundError())
    }

    const batch = await this.batchsRepository.findById(batchStock.batchId.toString())
    if (!batch) {
      return left(new ResourceNotFoundError())
    }

    if (quantity <= 0) {
      return left(new InvalidExitQuantityError())
    }

    if (quantity > batchStock.quantity) {
      return left(new InsufficientQuantityBatchInStockError(medicine.content, batch.code, quantity))
    }

    const batchStockUpdated = await this.batchStockskRepository.subtract(batcheStockId, quantity)

    if (!batchStockUpdated) {
      return left(new ResourceNotFoundError())
    }

    const exit = MedicineExit.create({
      batchStockId: new UniqueEntityId(batcheStockId),
      exitType,
      medicineStockId: medicineStock.id,
      operatorId,
      quantity,
      exitDate,
    })

    await this.medicineExitRepository.create(exit)

    return right(null)
  }
}
