import { RegisterEntryUseCase } from './register-entry'
import { InMemoryBatchestocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryMedicinesEntrysRepository } from 'test/repositories/in-memory-medicines-entries-repository'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchestock } from 'test/factories/make-batch-stock'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesEntrysRepository: InMemoryMedicinesEntrysRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchestocksRepository: InMemoryBatchestocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let sut: RegisterEntryUseCase

describe('Register Entry', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesEntrysRepository = new InMemoryMedicinesEntrysRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchestocksRepository = new InMemoryBatchestocksRepository(inMemoryMedicinesStockRepository)
    sut = new RegisterEntryUseCase(inMemoryMedicinesEntrysRepository, inMemoryMedicinesRepository, inMemoryMedicinesStockRepository, inMemoryBatchestocksRepository, inMemoryBatchesRepository)
  })
  it('shoult be able to register a new entry', async () => {
    const quantityToEntry = 20
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,

      medicineVariantId: medicine.id,
      stockId: stock.id,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)

    await inMemoryBatchestocksRepository.create(batchestock1)
    const result = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: quantityToEntry,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesEntrysRepository.items[0].quantity).toBe(quantityToEntry)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(quantityToEntry)
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(quantityToEntry)
    }
  })

  it('shoult not be able to register a new entry with quantity less or equal zero', async () => {
    const quantityToEntry = 0
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)

    await sut.execute({
      medicineVariantId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: 10,
    })
    const result = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: quantityToEntry,
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(10)
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(10)
    }
  })
  it('shoult not be to keep stock updated for entries from different batches', async () => {
    const quantityToEntryBatch1 = 10
    const quantityToEntryBatch2 = 15
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })
    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchestock({
      batchId: batch2.id,
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString(), batchestock2.id.toString()]
    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)
    await inMemoryBatchestocksRepository.create(batchestock2)

    const result1 = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: quantityToEntryBatch1,
    })
    const result2 = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      batcheStockId: batchestock2.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: quantityToEntryBatch2,
    })

    expect(result1.isRight()).toBeTruthy()
    expect(result2.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(2)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(quantityToEntryBatch1 + quantityToEntryBatch2)
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(quantityToEntryBatch1)
      expect(inMemoryBatchestocksRepository.items[1].quantity).toBe(quantityToEntryBatch2)
    }
  })
})
