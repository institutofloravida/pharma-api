import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryBatchsRepository } from 'test/repositories/in-memory-batchs-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { DispensationMedicineUseCase } from './dispensation-medicine'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchsRepository: InMemoryBatchsRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryDispensationsMedicinesRepository: InMemoryDispensationsMedicinesRepository
let sut: DispensationMedicineUseCase

describe('Dispensation Medicine', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryBatchsRepository = new InMemoryBatchsRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository(inMemoryMedicinesStockRepository)
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository()
    inMemoryDispensationsMedicinesRepository = new InMemoryDispensationsMedicinesRepository()

    sut = new DispensationMedicineUseCase(
      inMemoryDispensationsMedicinesRepository,
      inMemoryMedicinesExitsRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesStockRepository,
      inMemoryBatchStocksRepository,
      inMemoryBatchsRepository,
    )
  })
  it('must be able to dispense quantities of the same medication in different batches', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

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
      currentQuantity: 20,
    })

    const batch2 = makeBatch()
    await inMemoryBatchsRepository.create(batch2)

    const batchStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineId: medicine.id,
      stockId: stock.id,
      currentQuantity: 10,
    })

    medicineStock.batchsStockIds = [batchStock1.id.toString(), batchStock2.id.toString()]
    medicineStock.quantity = batchStock1.quantity + batchStock2.quantity

    await inMemoryBatchStocksRepository.create(batchStock1)
    await inMemoryBatchStocksRepository.create(batchStock2)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      userId: user.id.toString(),
      batchesStocks: [
        {
          batchStockId: batchStock1.id,
          quantity: 5,
        },
        {
          batchStockId: batchStock2.id,
          quantity: 10,
        },
      ],
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryDispensationsMedicinesRepository.items[0].totalQuantity).toEqual(result.value.dispensation.totalQuantity)

      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(15)
      expect(inMemoryBatchStocksRepository.items[1].quantity).toBe(0)
    }
  })
})
