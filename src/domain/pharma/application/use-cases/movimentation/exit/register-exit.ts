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
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import { MedicineStockNotExistsError } from '../../stock/medicine-stock/_errors/medicine-stock-not-exists-error'
import { MedicineVariantNotFoundError } from '../../auxiliary-records/medicine-variant/_errors/medicine-variant-not-found-error'
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation'
import { MovimentationRepository } from '../../../repositories/movimentation-repository'

interface RegisterExitUseCaseRequest {
  medicineStockId: string;
  operatorId: string;
  batcheStockId: string;
  quantity: number;
  exitType: ExitType;
  movementTypeId?: string;
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
    private medicinesVariantRepository: MedicinesVariantsRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchesStocksRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
    private movimentationRepository: MovimentationRepository,
  ) {}

  async execute({
    medicineStockId,
    operatorId,
    batcheStockId,
    quantity,
    movementTypeId,
    exitDate,
    exitType,
  }: RegisterExitUseCaseRequest): Promise<RegisterExitUseCaseResponse> {
    const medicineStock =
      await this.medicinesStockRepository.findById(medicineStockId)
    if (!medicineStock) {
      return left(new MedicineStockNotExistsError(medicineStockId))
    }

    const medicineVariant = await this.medicinesVariantRepository.findById(
      medicineStock.medicineVariantId.toString(),
    )
    if (!medicineVariant) {
      return left(new MedicineVariantNotFoundError(medicineStock.medicineVariantId.toString()))
    }

    const batchestock =
      await this.batchesStocksRepository.findById(batcheStockId)
    if (!batchestock) {
      return left(new ResourceNotFoundError())
    }

    const batch = await this.batchesRepository.findById(
      batchestock.batchId.toString(),
    )
    if (!batch) {
      return left(new ResourceNotFoundError())
    }

    if (quantity <= 0) {
      return left(new InvalidExitQuantityError())
    }

    if (quantity > batchestock.quantity) {
      return left(
        new InsufficientQuantityBatchInStockError(
          medicineVariant.medicineId.toString(),
          batch.code,
          quantity,
        ),
      )
    }

    await Promise.all([
      this.batchesStocksRepository.subtract(batcheStockId, quantity),
      this.medicinesStockRepository.subtract(
        medicineStock.id.toString(),
        quantity,
      ),
    ])

    const exit = MedicineExit.create({
      exitType,
      operatorId: new UniqueEntityId(operatorId),
      exitDate,
    })
    await this.medicineExitRepository.create(exit)

    const movimentation = Movimentation.create({
      batchStockId: new UniqueEntityId(batcheStockId),
      direction: 'EXIT',
      quantity,
      dispensationId: undefined,
      entryId: undefined,
      exitId: exit.id,
      movementTypeId: exitType === ExitType.MOVEMENT_TYPE
        ? new UniqueEntityId(movementTypeId)
        : undefined,
    })
    await this.movimentationRepository.create(movimentation)
    return right(null)
  }
}
