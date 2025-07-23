import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository'
import { BatchesRepository } from '../../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../../_errors/no-batch-in-stock-found-error'
import { MedicineEntry } from '../../../../enterprise/entities/entry'
import { MedicinesEntriesRepository } from '../../../repositories/medicines-entries-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidEntryQuantityError } from '../../_errors/invalid-entry-quantity-error'
import { Injectable } from '@nestjs/common'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { MedicineStock } from '@/domain/pharma/enterprise/entities/medicine-stock'
import { Batch } from '@/domain/pharma/enterprise/entities/batch'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import { BatchStocksRepository } from '../../../repositories/batch-stocks-repository'
import { BatchStock } from '@/domain/pharma/enterprise/entities/batch-stock'
import { AtLeastOneMustBePopulatedError } from '../_errors/at-least-one-must-be-populated-error'
import { StockNotFoundError } from '../../auxiliary-records/stock/_errors/stock-not-found-error'
import { MedicineVariantNotFoundError } from '../../auxiliary-records/medicine-variant/_errors/medicine-variant-not-found-error'
import { CreateMonthlyMedicineUtilizationUseCase } from '../../use-medicine/create-monthly-medicine-utilization'

interface RegisterMedicineEntryUseCaseRequest {
  stockId: string;
  operatorId: string;
  movementTypeId: string;
  nfNumber: string;
  entryDate?: Date;
  medicines: Array<{
    medicineVariantId: string;
    batches: Array<{
      code: string;
      expirationDate: Date;
      manufacturerId: string;
      manufacturingDate?: Date;
      quantityToEntry: number;
    }>;
  }>;
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
    private batcheStocksRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
    private createMonthlyMedicineUtilizationUseCase: CreateMonthlyMedicineUtilizationUseCase,
  ) {}

  async execute({
    stockId,
    operatorId,
    medicines,
    entryDate,
    movementTypeId,
    nfNumber,
  }: RegisterMedicineEntryUseCaseRequest): Promise<RegisterMedicineEntryUseCaseResponse> {
    if (medicines.length === 0) {
      return left(
        new AtLeastOneMustBePopulatedError(
          'Pelo menos um medicamento deve ser informado.',
        ),
      )
    }
    const stock = await this.stocksRepository.findById(stockId)

    if (!stock) {
      return left(new StockNotFoundError(stockId))
    }

    for (const medicine of medicines) {
      const { batches, medicineVariantId } = medicine

      const medicineVariant =
        await this.medicinesVariantsRepository.findById(medicineVariantId)
      if (!medicineVariant) {
        return left(new MedicineVariantNotFoundError(medicineVariantId))
      }

      if (batches.length === 0) {
        return left(
          new AtLeastOneMustBePopulatedError(
            'Pelo menos um lote deve ser informado.',
          ),
        )
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
          minimumLevel: 15,
          medicineVariantId: new UniqueEntityId(medicineVariantId),
          stockId: new UniqueEntityId(stockId),
        })
        await this.medicinesStockRepository.create(medicineStock)
      }

      let totalMovementBatches = 0
      for await (const batch of batches) {
        if (batch.quantityToEntry <= 0) {
          return left(new InvalidEntryQuantityError())
        }

        let batchStockExists = await this.batcheStocksRepository.exists(
          batch.code,
          batch.manufacturerId,
          stockId,
        )
        if (!batchStockExists) {
          let batchExists = await this.batchesRepository.exists(
            batch.code,
            batch.manufacturerId,
          )

          if (!batchExists) {
            batchExists = Batch.create({
              code: batch.code,
              expirationDate: batch.expirationDate,
              manufacturerId: new UniqueEntityId(batch.manufacturerId),
              manufacturingDate: batch.manufacturingDate,
            })
            await this.batchesRepository.create(batchExists)
          }

          batchStockExists = BatchStock.create({
            batchId: batchExists.id,
            currentQuantity: batch.quantityToEntry,
            medicineVariantId: medicineVariant.id,
            stockId: new UniqueEntityId(stockId),
            medicineStockId: medicineStock.id,
          })
          await this.batcheStocksRepository.create(batchStockExists)
        }

        const medicineStockHasBatchStock = medicineStock.batchesStockIds.some(
          (batchStockId) => batchStockId.equal(batchStockExists.id),
        )
        if (!medicineStockHasBatchStock) {
          await Promise.all([
            this.medicinesStockRepository.addBatchStock(
              medicineStock.id.toString(),
              batchStockExists.id.toString(),
            ),
            this.medicinesStockRepository.replenish(
              medicineStock.id.toString(),
              batchStockExists.quantity,
            ),
          ])
        } else {
          await Promise.all([
            this.batcheStocksRepository.replenish(
              batchStockExists.id.toString(),
              batch.quantityToEntry,
            ),
            this.medicinesStockRepository.replenish(
              medicineStock.id.toString(),
              batch.quantityToEntry,
            ),
          ])
        }

        totalMovementBatches += batch.quantityToEntry
        const entry = MedicineEntry.create({
          batcheStockId: batchStockExists.id,
          movementTypeId: new UniqueEntityId(movementTypeId),
          medicineStockId: medicineStock.id,
          operatorId: new UniqueEntityId(operatorId),
          quantity: totalMovementBatches,
          nfNumber,
          entryDate,
        })
        await this.createMonthlyMedicineUtilizationUseCase.execute({
          date: new Date(),
        })

        await this.medicineEntryRepository.create(entry)
      }
    }
    return right(null)
  }
}
