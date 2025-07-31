import { left, right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import {
  ExitType,
  MedicineExit,
} from '@/domain/pharma/enterprise/entities/exit'
import { Injectable } from '@nestjs/common'
import { BatchStocksRepository } from '../../../repositories/batch-stocks-repository'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository'
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository'
import { InsufficientQuantityBatchInStockError } from '../../_errors/insufficient-quantity-batch-in-stock-error'
import { InvalidExitQuantityError } from '../../_errors/invalid-exit-quantity-error'
import { NoBatchInStockFoundError } from '../../_errors/no-batch-in-stock-found-error'
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation'
import { MovimentationRepository } from '../../../repositories/movimentation-repository'
import { AtLeastOneMustBePopulatedError } from '../_errors/at-least-one-must-be-populated-error'

interface RegisterExitUseCaseRequest {
  batches: {
    batcheStockId: string;
    quantity: number;
  }[],
  stockId: string;
  operatorId: string;
  exitType: ExitType;
  movementTypeId?: string;
  destinationInstitutionId?: string;
  exitDate?: Date;
}

type RegisterExitUseCaseResponse = Either<
  | ResourceNotFoundError
  | NoBatchInStockFoundError
  | InvalidExitQuantityError
  | InsufficientQuantityBatchInStockError,
  null
>

@Injectable()
export class RegisterExitUseCase {
  constructor(
    private medicineExitRepository: MedicinesExitsRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchesStocksRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
    private movimentationRepository: MovimentationRepository,
  ) {}

  async execute({
    operatorId,
    movementTypeId,
    exitDate,
    exitType,
    stockId,
    batches,
    destinationInstitutionId,
  }: RegisterExitUseCaseRequest): Promise<RegisterExitUseCaseResponse> {
    if (batches.length <= 0) {
      return left(new AtLeastOneMustBePopulatedError('É necessário ter pelo menos um lote para efetuar a saída '))
    }
    for (const itemBatch of batches) {
      if (itemBatch.quantity <= 0) {
        return left(new InvalidExitQuantityError())
      }
    }

    if (destinationInstitutionId && exitType !== ExitType.DONATION) {
      return left(new Error('A instituição de destino só pode ser informada quando o tipo de saída for DOAÇÃO'))
    }

    const exit = MedicineExit.create({
      exitType,
      operatorId: new UniqueEntityId(operatorId),
      exitDate,
      stockId: new UniqueEntityId(stockId),
      destinationInstitutionId: destinationInstitutionId
        ? new UniqueEntityId(destinationInstitutionId)
        : undefined,
    })
    await this.medicineExitRepository.create(exit)

    for await (const itemBatch of batches) {
      const batchestock =
      await this.batchesStocksRepository.findById(itemBatch.batcheStockId)
      if (!batchestock) {
        return left(new ResourceNotFoundError())
      }

      const batch = await this.batchesRepository.findById(
        batchestock.batchId.toString(),
      )
      if (!batch) {
        return left(new ResourceNotFoundError())
      }

      if (itemBatch.quantity > batchestock.quantity) {
        return left(
          new InsufficientQuantityBatchInStockError(
            itemBatch.batcheStockId,
            batch.code,
            itemBatch.quantity,
          ),
        )
      }

      const movimentation = Movimentation.create({
        batchStockId: new UniqueEntityId(itemBatch.batcheStockId),
        direction: 'EXIT',
        quantity: itemBatch.quantity,
        dispensationId: undefined,
        entryId: undefined,
        exitId: exit.id,
        movementTypeId: exitType === ExitType.MOVEMENT_TYPE
          ? new UniqueEntityId(movementTypeId)
          : undefined,
      })

      await Promise.all([
        this.batchesStocksRepository.subtract(itemBatch.batcheStockId, itemBatch.quantity),
        this.medicinesStockRepository.subtract(
          batchestock.medicineStockId.toString(),
          itemBatch.quantity,
        ),
        this.movimentationRepository.create(movimentation),
      ])
    }
    return right(null)
  }
}
