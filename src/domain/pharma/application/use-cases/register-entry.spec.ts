import { RegisterEntryUseCase } from './register-entry'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchsRepository } from 'test/repositories/in-memory-batchs-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryMedicinesEntrysRepository } from 'test/repositories/in-memory-medicines-entries-repository'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'

let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesEntrysRepository: InMemoryMedicinesEntrysRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchsRepository: InMemoryBatchsRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let sut: RegisterEntryUseCase

describe('Register Entry', () => {
  beforeEach(() => {
    inMemoryStocksRepository = new InMemoryStocksRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesEntrysRepository = new InMemoryMedicinesEntrysRepository()
    inMemoryBatchsRepository = new InMemoryBatchsRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository(inMemoryMedicinesStockRepository)
    sut = new RegisterEntryUseCase(inMemoryMedicinesEntrysRepository, inMemoryMedicinesRepository, inMemoryMedicinesStockRepository, inMemoryBatchStocksRepository, inMemoryBatchsRepository)
  })
  it('shoult be able to register a new entry', async () => {
    const quantityToEntry = 20
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchsStockIds: [],
      medicineId: medicine.id,
      stockId: stock.id,

    })

    const batch1 = makeBatch()
    await inMemoryBatchsRepository.create(batch1)

    const batchStock1 = makeBatchStock({
      batchId: batch1.id,
      medicineId: medicine.id,
      stockId: stock.id,
    })
    medicineStock.batchsStockIds = [batchStock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchStocksRepository.create(batchStock1)
    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchStock1.id.toString(),
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
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(quantityToEntry)
    }
  })

  it('shoult not be able to register a new entry with quantity less or equal zero', async () => {
    const quantityToEntry = 0
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchsStockIds: [],
      medicineId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchsRepository.create(batch1)

    const batchStock1 = makeBatchStock({
      batchId: batch1.id,
      medicineId: medicine.id,
      stockId: stock.id,
    })
    medicineStock.batchsStockIds = [batchStock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchStocksRepository.create(batchStock1)

    await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchStock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: 10,
    })
    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchStock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: quantityToEntry,
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(10)
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(10)
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
      batchsStockIds: [],
      medicineId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchsRepository.create(batch1)

    const batchStock1 = makeBatchStock({
      batchId: batch1.id,
      medicineId: medicine.id,
      stockId: stock.id,
    })
    const batch2 = makeBatch()
    await inMemoryBatchsRepository.create(batch2)

    const batchStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineId: medicine.id,
      stockId: stock.id,
    })
    medicineStock.batchsStockIds = [batchStock1.id.toString(), batchStock2.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchStocksRepository.create(batchStock1)
    await inMemoryBatchStocksRepository.create(batchStock2)

    const result1 = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchStock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      quantity: quantityToEntryBatch1,
    })
    const result2 = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchStock2.id.toString(),
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
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(quantityToEntryBatch1)
      expect(inMemoryBatchStocksRepository.items[1].quantity).toBe(quantityToEntryBatch2)
    }
  })
})
