import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchestocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { DispensationMedicineUseCase } from './dispensation-medicine'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchestock } from 'test/factories/make-batch-stock'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchestocksRepository: InMemoryBatchestocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryDispensationsMedicinesRepository: InMemoryDispensationsMedicinesRepository
let sut: DispensationMedicineUseCase

describe('Dispensation Medicine', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchestocksRepository = new InMemoryBatchestocksRepository(inMemoryMedicinesStockRepository)
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository()
    inMemoryDispensationsMedicinesRepository = new InMemoryDispensationsMedicinesRepository()

    sut = new DispensationMedicineUseCase(
      inMemoryDispensationsMedicinesRepository,
      inMemoryMedicinesExitsRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesStockRepository,
      inMemoryBatchestocksRepository,
      inMemoryBatchesRepository,
    )
  })
  it('should be able to dispense a medication', async () => {
    const quantityToDispense = 5
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

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
      currentQuantity: 20,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]
    medicineStock.quantity = batchestock1.quantity

    await inMemoryBatchestocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      userId: user.id.toString(),
      batchesStocks: [
        {
          batchestockId: batchestock1.id,
          quantity: quantityToDispense,
        },
      ],
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryDispensationsMedicinesRepository.items[0].totalQuantity).toEqual(result.value.dispensation.totalQuantity)

      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(20 - quantityToDispense)
    }
  })
  it('should not be able to dispense a medication with batch expired', async () => {
    const date = new Date('2024-02-15')
    vi.setSystemTime(date)

    const quantityToDispense = 5
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch({
      expirationDate: new Date('2024-02-15'),
    })
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchestock({
      batchId: batch1.id,
      medicineVariantId: medicine.id,
      stockId: stock.id,
      currentQuantity: 20,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]
    medicineStock.quantity = batchestock1.quantity

    await inMemoryBatchestocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      userId: user.id.toString(),
      batchesStocks: [
        {
          batchestockId: batchestock1.id,
          quantity: quantityToDispense,
        },
      ],
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(0)
      expect(inMemoryBatchestocksRepository.items[0]).toBe(20)
    }
  })
  it('should be able to dispense quantities of the same medication in different batches', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

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
      currentQuantity: 20,
    })

    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchestock({
      batchId: batch2.id,
      medicineVariantId: medicine.id,
      stockId: stock.id,
      currentQuantity: 10,
    })

    medicineStock.batchesStockIds = [batchestock1.id.toString(), batchestock2.id.toString()]
    medicineStock.quantity = batchestock1.quantity + batchestock2.quantity

    await inMemoryBatchestocksRepository.create(batchestock1)
    await inMemoryBatchestocksRepository.create(batchestock2)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineVariantId: medicine.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      userId: user.id.toString(),
      batchesStocks: [
        {
          batchestockId: batchestock1.id,
          quantity: 5,
        },
        {
          batchestockId: batchestock2.id,
          quantity: 10,
        },
      ],
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryDispensationsMedicinesRepository.items[0].totalQuantity).toEqual(result.value.dispensation.totalQuantity)

      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(15)
      expect(inMemoryBatchestocksRepository.items[1].quantity).toBe(0)
    }
  })
})
