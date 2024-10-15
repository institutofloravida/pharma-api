import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { CreateMedicineStockUseCase } from './create-medicine-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryBatchsRepository } from 'test/repositories/in-memory-batchs-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchsRepository: InMemoryBatchsRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let sut: CreateMedicineStockUseCase

describe('MedicineStock', () => {
  beforeEach(() => {
    inMemoryStocksRepository = new InMemoryStocksRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryBatchsRepository = new InMemoryBatchsRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository(inMemoryMedicinesStockRepository)

    sut = new CreateMedicineStockUseCase(
      inMemoryStocksRepository,
      inMemoryMedicinesRepository,
      inMemoryBatchsRepository,
      inMemoryBatchStocksRepository,
      inMemoryMedicinesStockRepository,
    )
  })
  it('shoult be able create a medicine stock', async () => {
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineId: medicine.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(result.value?.medicineStock.quantity)
    }
  })
  it('not should allowed duplicity', async () => {
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineId: medicine.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    const result2 = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineId: medicine.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].id).toBe(result.value?.medicineStock.id)
    }
  })
})
