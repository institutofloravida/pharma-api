import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { BatchestocksRepository } from '../../repositories/batch-stocks-repository'
import { BatchesRepository } from '../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import { MedicineExit, type ExitType } from '../../../enterprise/entities/exit'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidExitQuantityError } from '../_errors/invalid-exit-quantity-error'
import { InsufficientQuantityBatchInStockError } from '../_errors/insufficient-quantity-batch-in-stock-error'
import { Injectable } from '@nestjs/common'

interface RegisterExitUseCaseRequest {
  medicineVariantId: string
  stockId: string
  operatorId: string
  batcheStockId: string
  quantity: number
  exitType: ExitType
  exitDate?: Date
}

type RegisterExitUseCaseResponse = Either<
  ResourceNotFoundError |
  NoBatchInStockFoundError |
  InvalidExitQuantityError |
  InsufficientQuantityBatchInStockError,
  null
>

@Injectable()
export class RegisterExitUseCase {
  constructor(
    private medicineExitRepository: MedicinesExitsRepository,
    private medicinesRepository: MedicinesRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchestockskRepository: BatchestocksRepository,
    private batchesRepository: BatchesRepository,
  ) {}

  async execute({
    medicineVariantId,
    stockId,
    operatorId,
    batcheStockId,
    quantity,
    exitDate,
    exitType,
  }: RegisterExitUseCaseRequest): Promise<RegisterExitUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(medicineVariantId)
    if (!medicine) {
      return left(new ResourceNotFoundError())
    }

    const medicineStock = await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(medicineVariantId, stockId)
    if (!medicineStock) {
      return left(new NoBatchInStockFoundError(medicine.content))
    }

    const batchestock = await this.batchestockskRepository.findById(batcheStockId)
    if (!batchestock) {
      return left(new ResourceNotFoundError())
    }

    const batch = await this.batchesRepository.findById(batchestock.batchId.toString())
    if (!batch) {
      return left(new ResourceNotFoundError())
    }

    if (quantity <= 0) {
      return left(new InvalidExitQuantityError())
    }

    if (quantity > batchestock.quantity) {
      return left(new InsufficientQuantityBatchInStockError(medicine.content, batch.code, quantity))
    }

    const batchestockUpdated = await this.batchestockskRepository.subtract(batcheStockId, quantity)

    if (!batchestockUpdated) {
      return left(new ResourceNotFoundError())
    }

    const exit = MedicineExit.create({
      batchestockId: new UniqueEntityId(batcheStockId),
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
