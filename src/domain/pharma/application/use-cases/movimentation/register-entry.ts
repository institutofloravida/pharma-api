import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { BatchestocksRepository } from '../../repositories/batch-stocks-repository'
import { BatchesRepository } from '../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import { MedicineEntry, type EntryType } from '../../../enterprise/entities/entry'
import { MedicinesEntriesRepository } from '../../repositories/medicines-entries-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidEntryQuantityError } from '../_errors/invalid-entry-quantity-error'
import { Injectable } from '@nestjs/common'

interface RegisterEntryUseCaseRequest {
  medicineVariantId: string
  stockId: string
  operatorId: string
  batcheStockId: string
  quantity: number
  entryType: EntryType
  entryDate?: Date
}

type RegisterEntryUseCaseResponse = Either<
  ResourceNotFoundError | InvalidEntryQuantityError | NoBatchInStockFoundError,
  null
>

@Injectable()
export class RegisterEntryUseCase {
  constructor(
    private medicineEntryRepository: MedicinesEntriesRepository,
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
    entryDate,
    entryType,
  }: RegisterEntryUseCaseRequest): Promise<RegisterEntryUseCaseResponse> {
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
      return left(new InvalidEntryQuantityError())
    }

    await this.batchestockskRepository.replenish(batcheStockId, quantity)

    const entry = MedicineEntry.create({
      batcheStockId: new UniqueEntityId(batcheStockId),
      entryType,
      medicineStockId: medicineStock.id,
      operatorId,
      quantity,
      entryDate,
    })

    await this.medicineEntryRepository.create(entry)

    return right(null)
  }
}
