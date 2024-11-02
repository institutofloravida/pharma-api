import { RegisterExitUseCase } from './register-exit'
import { InMemoryBatchestocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchestock } from 'test/factories/make-batch-stock'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'

let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchestocksRepository: InMemoryBatchestocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let sut: RegisterExitUseCase

describe('Register Exit', () => {
  beforeEach(() => {
    inMemoryStocksRepository = new InMemoryStocksRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchestocksRepository = new InMemoryBatchestocksRepository(inMemoryMedicinesStockRepository)
    sut = new RegisterExitUseCase(inMemoryMedicinesExitsRepository, inMemoryMedicinesRepository, inMemoryMedicinesStockRepository, inMemoryBatchestocksRepository, inMemoryBatchesRepository)
  })
  it('shoult be able to register a new exit', async () => {
    const quantityToExit = 5
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,
      medicineId: medicine.id,
      stockId: stock.id,
      currentQuantity: 30,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)
    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityToExit,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesExitsRepository.items[0].quantity).toBe(quantityToExit)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(30 - quantityToExit)
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(30 - quantityToExit)
    }
  })

  it('shoult not be able to register a new exit with quantity less or equal zero', async () => {
    const quantityZeroToExit = 0
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,
      medicineId: medicine.id,
      stockId: stock.id,
      currentQuantity: 50,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)

    await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityZeroToExit + 5,
    })
    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityZeroToExit,
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(45)
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(45)
    }
  })
  it('shoult not be to keep stock updated for exits from different batches', async () => {
    const quantityToExitBatch1 = 10
    const quantityToExitBatch2 = 15
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,
      medicineId: medicine.id,
      stockId: stock.id,
      currentQuantity: 30,
    })
    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchestock({
      batchId: batch2.id,
      medicineId: medicine.id,
      stockId: stock.id,
      currentQuantity: 25,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString(), batchestock2.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)
    await inMemoryBatchestocksRepository.create(batchestock2)

    const result1 = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchestock1.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityToExitBatch1,
    })
    const result2 = await sut.execute({
      medicineId: medicine.id.toString(),
      batcheStockId: batchestock2.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      exitType: 'OTHER',
      quantity: quantityToExitBatch2,
    })

    expect(result1.isRight()).toBeTruthy()
    expect(result2.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(2)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe((30 - quantityToExitBatch1) + (25 - quantityToExitBatch2))
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(30 - quantityToExitBatch1)
      expect(inMemoryBatchestocksRepository.items[1].quantity).toBe(25 - quantityToExitBatch2)
    }
  })
})