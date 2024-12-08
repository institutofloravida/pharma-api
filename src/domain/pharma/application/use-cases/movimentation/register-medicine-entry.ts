import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { BatchesRepository } from '../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import {
  MedicineEntry,
} from '../../../enterprise/entities/entry'
import { MedicinesEntriesRepository } from '../../repositories/medicines-entries-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidEntryQuantityError } from '../_errors/invalid-entry-quantity-error'
import { Injectable } from '@nestjs/common'
import { StocksRepository } from '../../repositories/stocks-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'
import { MedicinesVariantsRepository } from '../../repositories/medicine-variant-repository'
import { BatchStocksRepository } from '../../repositories/batch-stocks-repository'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'

interface RegisterMedicineEntryUseCaseRequest {
  medicineVariantId: string;
  stockId: string;
  operatorId: string;
  batches?: {
    batchId: string;
    quantityToEntry: number;
  }[];
  newBatches?: {
    code: string;
    expirationDate: Date;
    manufacturerId: string;
    manufacturingDate?: Date;
    quantityToEntry: number;
  }[];
  movementTypeId: string
  entryDate?: Date;
}

type RegisterMedicineEntryUseCaseResponse = Either<
  ResourceNotFoundError | InvalidEntryQuantityError | NoBatchInStockFoundError,
  null
>

@Injectable()
export class RegisterMedicineEntryUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private medicineEntryRepository: MedicinesEntriesRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchestocksRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({
    medicineVariantId,
    stockId,
    operatorId,
    batches,
    newBatches,
    entryDate,
    movementTypeId,
  }: RegisterMedicineEntryUseCaseRequest): Promise<RegisterMedicineEntryUseCaseResponse> {
    if ((!batches && !newBatches) || (batches?.length === 0 && newBatches?.length === 0)) {
      return left(new Error('AHHHHHHHHHHHH'))
    }
    const stock = await this.stocksRepository.findById(stockId)
    if (!stock) {
      return left(new ResourceNotFoundError())
    }

    const medicineVariant =
      await this.medicinesVariantsRepository.findById(medicineVariantId)
    if (!medicineVariant) {
      return left(new ResourceNotFoundError())
    }

    let medicineStock =
      await this.medicinesStockRepository.findByMedicineVariantIdAndStockId(
        medicineVariantId,
        stockId,
      )
    if (!medicineStock) {
      medicineStock = MedicineStock.create({
        batchesStockIds: [],
        currentQuantity: 0,
        medicineVariantId: new UniqueEntityId(medicineVariantId),
        stockId: new UniqueEntityId(stockId),
      })
      await this.medicinesStockRepository.create(medicineStock)
    }

    let totalMovementBatches = 0
    if (batches) {
      for (const batch of batches) {
        if (batch.quantityToEntry <= 0) {
          return left(new InvalidEntryQuantityError())
        }

        const batchExists = await this.batchesRepository.findById(batch.batchId)
        if (!batchExists) {
          return left(new ResourceNotFoundError())
        }

        let batchStock =
        await this.batchestocksRepository.findByBatchIdAndStockId(
          batch.batchId,
          stockId,
        )

        if (!batchStock) {
          batchStock = BatchStock.create({
            batchId: new UniqueEntityId(batch.batchId),
            currentQuantity: batch.quantityToEntry,
            medicineVariantId: medicineVariant.id,
            stockId: new UniqueEntityId(stockId),
          })

          await this.batchestocksRepository.create(batchStock)
        } else {
          await this.batchestocksRepository.replenish(
            batchStock.id.toString(),
            batch.quantityToEntry,
          )
        }

        totalMovementBatches += batch.quantityToEntry
        const entry = MedicineEntry.create({
          batcheStockId: new UniqueEntityId(batchStock.id.toString()),
          movementTypeId: new UniqueEntityId(movementTypeId),
          medicineStockId: medicineStock.id,
          operatorId: new UniqueEntityId(operatorId),
          quantity: totalMovementBatches,
          entryDate,
        })

        await this.medicineEntryRepository.create(entry)
      }
    }

    let totalMovementNewBatches = 0

    if (newBatches) {
      for (const newBatch of newBatches) {
        const {
          code,
          expirationDate,
          manufacturerId,
          manufacturingDate,
          quantityToEntry,
        } = newBatch

        if (quantityToEntry <= 0) {
          return left(new InvalidEntryQuantityError())
        }

        const batch = Batch.create({
          code,
          expirationDate,
          manufacturerId: new UniqueEntityId(manufacturerId),
          manufacturingDate,
        })

        await this.batchesRepository.create(batch)

        const batchStock = BatchStock.create({
          batchId: batch.id,
          currentQuantity: quantityToEntry,
          medicineVariantId: medicineVariant.id,
          stockId: new UniqueEntityId(stockId),
        })

        medicineStock.addBatchStockId(batchStock.id)
        await this.medicinesStockRepository.save(medicineStock)
        await this.batchestocksRepository.create(batchStock)

        totalMovementNewBatches += quantityToEntry

        const entry = MedicineEntry.create({
          batcheStockId: new UniqueEntityId(batchStock.id.toString()),
          movementTypeId: new UniqueEntityId(movementTypeId),
          medicineStockId: medicineStock.id,
          operatorId: new UniqueEntityId(operatorId),
          quantity: totalMovementNewBatches,
          entryDate,
        })

        await this.medicineEntryRepository.create(entry)
      }
    }

    return right(null)
  }
}
