import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { BatchStocksRepository } from '../../repositories/batch-stocks-repository'
import { BatchsRepository } from '../../repositories/batchs-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import { InsufficientQuantityInStockError } from '../_errors/insufficient-quantity-in-stock-error'
import { InsufficientQuantityBatchInStockError } from '../_errors/insufficient-quantity-batch-in-stock-error'
import { MedicineExit } from '../../../enterprise/entities/exit'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { Dispensation } from '../../../enterprise/entities/dispensation'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { MovimentationBatchStock } from '../../../enterprise/entities/batch-stock'
import { ExpiredMedicineDispenseError } from '../_errors/expired-medicine-dispense-error'
import { Injectable } from '@nestjs/common'

interface DispensationMedicineUseCaseRequest {
  medicineId: string
  stockId: string
  userId: string
  operatorId: string
  batchesStocks: MovimentationBatchStock[]
  dispensationDate?: Date
}

type DispensationMedicineUseCaseResponse = Either<
  ResourceNotFoundError |
  InsufficientQuantityInStockError |
  NoBatchInStockFoundError |
  InsufficientQuantityBatchInStockError |
  ExpiredMedicineDispenseError,
  {
    dispensation: Dispensation
  }
>

@Injectable()
export class DispensationMedicineUseCase {
  constructor(
    private dispensationsMedicinesRepository: DispensationsMedicinesRepository,
    private medicinesExitsRepository: MedicinesExitsRepository,
    private medicinesRepository: MedicinesRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchStockskRepository: BatchStocksRepository,
    private batchsRepository: BatchsRepository,
  ) { }

  async execute({
    medicineId,
    stockId,
    userId,
    operatorId,
    batchesStocks,
    dispensationDate,
  }: DispensationMedicineUseCaseRequest): Promise<DispensationMedicineUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(medicineId)
    if (!medicine) {
      return left(new ResourceNotFoundError())
    }

    const medicineStock = await this.medicinesStockRepository.findByMedicineIdAndStockId(medicineId, stockId)
    if (!medicineStock) {
      return left(new NoBatchInStockFoundError(medicine.content))
    }

    let totalQuantityToDispense = 0

    for (const item of batchesStocks) {
      const batchStock = await this.batchStockskRepository.findById(item.batchStockId.toString())
      if (!batchStock) {
        return left(new ResourceNotFoundError())
      }

      const batch = await this.batchsRepository.findById(batchStock.batchId.toString())
      if (!batch) {
        return left(new ResourceNotFoundError())
      }

      const expirationDate = new Date(batch.expirationDate)

      if (expirationDate <= new Date()) {
        return left(new ExpiredMedicineDispenseError(batch.code, medicine.content))
      }

      if (batchStock.quantity < item.quantity) {
        return left(new InsufficientQuantityBatchInStockError(medicine.content, batch.code, batchStock.quantity))
      }

      totalQuantityToDispense += item.quantity
    }

    if (medicineStock.quantity < totalQuantityToDispense) {
      return left(new InsufficientQuantityInStockError(medicine.content, medicineStock.quantity))
    }

    for (const item of batchesStocks) {
      const medicineExit = MedicineExit.create({
        medicineStockId: medicineStock.id,
        batchStockId: item.batchStockId,
        exitDate: dispensationDate,
        exitType: 'DISPENSATION',
        quantity: item.quantity,
        operatorId,
      })

      await this.medicinesExitsRepository.create(medicineExit)
      await this.batchStockskRepository.subtract(item.batchStockId.toString(), item.quantity)
    }

    const dispensation = Dispensation.create({
      userId: new UniqueEntityId(userId),
      dispensationDate,
      batchsStocks: batchesStocks,
    })

    await this.dispensationsMedicinesRepository.create(dispensation)

    return right({ dispensation })
  }
}
