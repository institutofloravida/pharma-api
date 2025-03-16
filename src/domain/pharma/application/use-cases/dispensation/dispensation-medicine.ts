import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { BatchesRepository } from '../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import { InsufficientQuantityInStockError } from '../_errors/insufficient-quantity-in-stock-error'
import { InsufficientQuantityBatchInStockError } from '../_errors/insufficient-quantity-batch-in-stock-error'
import { ExitType, MedicineExit } from '../../../enterprise/entities/exit'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { Dispensation } from '../../../enterprise/entities/dispensation'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { ExpiredMedicineDispenseError } from '../_errors/expired-medicine-dispense-error'
import { Injectable } from '@nestjs/common'
import { BatchStocksRepository } from '../../repositories/batch-stocks-repository'
import { MedicinesVariantsRepository } from '../../repositories/medicine-variant-repository'
import { MedicineStockNotFoundError } from '../stock/medicine-stock/_errors/medicine-stock-not-found-error'

interface DispensationMedicineUseCaseRequest {
  medicineStockId: string;
  patientId: string;
  operatorId: string;
  batchesStocks: { batchStockId: string, quantity: number }[];
  dispensationDate?: Date;
}

type DispensationMedicineUseCaseResponse = Either<
  | ResourceNotFoundError
  | InsufficientQuantityInStockError
  | NoBatchInStockFoundError
  | InsufficientQuantityBatchInStockError
  | ExpiredMedicineDispenseError,
  {
    dispensation: Dispensation;
  }
>

@Injectable()
export class DispensationMedicineUseCase {
  constructor(
    private dispensationsMedicinesRepository: DispensationsMedicinesRepository,
    private medicinesExitsRepository: MedicinesExitsRepository,
    private medicinesRepository: MedicinesRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchestockskRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
  ) {}

  async execute({
    medicineStockId,
    patientId,
    operatorId,
    batchesStocks,
    dispensationDate,
  }: DispensationMedicineUseCaseRequest): Promise<DispensationMedicineUseCaseResponse> {
    const medicineStock =
      await this.medicinesStockRepository.findById(
        medicineStockId,
      )
    if (!medicineStock) {
      return left(new MedicineStockNotFoundError(medicineStockId))
    }
    const medicineVariant =
      await this.medicinesVariantsRepository.findById(medicineStock.medicineVariantId.toString())
    if (!medicineVariant) {
      return left(new ResourceNotFoundError())
    }
    const medicine = await this.medicinesRepository.findById(
      medicineVariant.medicineId.toString(),
    )
    if (!medicine) {
      return left(new ResourceNotFoundError())
    }

    let totalQuantityToDispense = 0

    for (const item of batchesStocks) {
      const batchestock = await this.batchestockskRepository.findById(
        item.batchStockId,
      )
      if (!batchestock) {
        return left(new ResourceNotFoundError())
      }

      const batch = await this.batchesRepository.findById(
        batchestock.batchId.toString(),
      )
      if (!batch) {
        return left(new ResourceNotFoundError())
      }

      const expirationDate = new Date(batch.expirationDate)

      if (expirationDate <= new Date()) {
        return left(
          new ExpiredMedicineDispenseError(batch.code, medicine.content),
        )
      }

      if (batchestock.quantity < item.quantity) {
        return left(
          new InsufficientQuantityBatchInStockError(
            medicine.content,
            batch.code,
            batchestock.quantity,
          ),
        )
      }

      totalQuantityToDispense += item.quantity
    }

    if (medicineStock.quantity < totalQuantityToDispense) {
      return left(
        new InsufficientQuantityInStockError(
          medicine.content,
          medicineStock.quantity,
        ),
      )
    }

    const dispensation = Dispensation.create({
      patientId: new UniqueEntityId(patientId),
      dispensationDate,
      operatorId: new UniqueEntityId(operatorId),
    })

    await this.dispensationsMedicinesRepository.create(dispensation)

    for (const item of batchesStocks) {
      const medicineExit = MedicineExit.create({
        medicineStockId: medicineStock.id,
        batchestockId: new UniqueEntityId(item.batchStockId),
        exitDate: dispensationDate,
        exitType: ExitType.DISPENSATION,
        dispensationId: dispensation.id,
        quantity: item.quantity,
        operatorId: new UniqueEntityId(operatorId),
      })

      await Promise.all([
        this.medicinesExitsRepository.create(medicineExit),
        this.batchestockskRepository.subtract(
          item.batchStockId.toString(),
          item.quantity,
        ),
        this.medicinesStockRepository.subtract(
          medicineStock.id.toString(),
          item.quantity,
        ),
      ])
    }

    return right({ dispensation })
  }
}
