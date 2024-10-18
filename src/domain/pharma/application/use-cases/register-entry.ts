import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import type { MedicinesStockRepository } from '../repositories/medicines-stock-repository'
import type { MedicinesRepository } from '../repositories/medicines-repository'
import type { BatchStocksRepository } from '../repositories/batch-stocks-repository'
import type { BatchsRepository } from '../repositories/batchs-repository'
import { NoBatchInStockFoundError } from './_errors/no-batch-in-stock-found-error'
import { MedicineEntry, type EntryType } from '../../enterprise/entities/entry'
import type { MedicinesEntriesRepository } from '../repositories/medicines-entries-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidEntryQuantityError } from './_errors/invalid-entry-quantity-error'

interface RegisterEntryUseCaseRequest {
  medicineId: string
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
export class RegisterEntryUseCase {
  constructor(
    private medicineEntryRepository: MedicinesEntriesRepository,
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
    entryDate,
    entryType,
  }: RegisterEntryUseCaseRequest): Promise<RegisterEntryUseCaseResponse> {
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
      return left(new InvalidEntryQuantityError())
    }

    await this.batchStockskRepository.replenish(batcheStockId, quantity)

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
