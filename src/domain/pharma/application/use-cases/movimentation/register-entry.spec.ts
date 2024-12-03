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
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesEntrysRepository: InMemoryMedicinesEntrysRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchestocksRepository: InMemoryBatchestocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let sut: RegisterEntryUseCase

describe('Register Entry', () => {
  beforeEach(() => {
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesEntrysRepository = new InMemoryMedicinesEntrysRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository()
    inMemoryBatchestocksRepository = new InMemoryBatchestocksRepository(
      inMemoryMedicinesStockRepository,
    )
    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      )

    sut = new RegisterEntryUseCase(
      inMemoryStocksRepository,
      inMemoryMedicinesEntrysRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesStockRepository,
      inMemoryBatchestocksRepository,
      inMemoryBatchesRepository,
      inMemoryMedicinesVariantsRepository,
    )
  })
  it('shoult be able to register a new entry', async () => {
    const quantityToEntry = 20

    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      newBatches: [
        {
          code: 'ABCDE',
          expirationDate: new Date(2025, 1, 1),
          manufacturerId: 'asasas',
          quantityToEntry,
        },
      ],
      batches: [],
    })
    console.log(inMemoryMedicinesVariantsRepository.items)
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesEntrysRepository.items[0].quantity).toBe(
        quantityToEntry,
      )
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(
        quantityToEntry,
      )
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(
        quantityToEntry,
      )
    }
  })

  it('shoult not be able to register a new entry with quantity less or equal zero', async () => {
    const quantityToEntry = 20
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchestock1 = makeBatchestock({
      batchId: batch.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    medicineStock.batchesStockIds = [batchestock1.id.toString()]

    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)

    await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batches: [
        {
          batchId: batch.id.toString(),
          quantityToEntry,
        },
      ],
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
    })
    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      newBatches: [
        {
          code: 'ABCDE10',
          expirationDate: new Date(2025, 10, 5),
          manufacturerId: 'sds',
          quantityToEntry: 0,
        },
      ],
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      batches: [
        {
          batchId: batch.id.toString(),
          quantityToEntry: 0,
        },
      ],
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(
        quantityToEntry,
      )
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(
        quantityToEntry,
      )
    }
  })
  it('shoult be to keep stock updated for entries from different batches', async () => {
    const quantityToEntryBatch = 10
    const quantityToEntryBatch2 = 15
    const quantityToEntryBatch3 = 20

    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchestock1 = makeBatchestock({
      batchId: batch.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchestock({
      batchId: batch2.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    medicineStock.batchesStockIds = [
      batchestock1.id.toString(),
      batchestock2.id.toString(),
    ]
    await inMemoryMedicinesStockRepository.create(medicineStock)
    await inMemoryBatchestocksRepository.create(batchestock1)
    await inMemoryBatchestocksRepository.create(batchestock2)

    const result1 = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      batches: [
        {
          batchId: batch.id.toString(),
          quantityToEntry: quantityToEntryBatch,
        },
        {
          batchId: batch2.id.toString(),
          quantityToEntry: quantityToEntryBatch2,
        },
      ],
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
    })
    const batch3 = makeBatch()
    const result2 = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      newBatches: [
        {
          code: batch3.code,
          expirationDate: batch3.expirationDate,
          manufacturerId: batch3.manufacturerId.toString(),
          quantityToEntry: quantityToEntryBatch3,
        },
      ],
      stockId: stock.id.toString(),
      operatorId: 'operator-1',
      entryType: 'DONATION',
      batches: [],
    })

    expect(result1.isRight()).toBeTruthy()
    expect(result2.isRight()).toBeTruthy()
    if (result1.isRight()) {
      expect(inMemoryMedicinesEntrysRepository.items).toHaveLength(3)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(
        quantityToEntryBatch + quantityToEntryBatch2 + quantityToEntryBatch3,
      )
      expect(inMemoryBatchestocksRepository.items[0].quantity).toBe(
        quantityToEntryBatch,
      )
      expect(inMemoryBatchestocksRepository.items[1].quantity).toBe(
        quantityToEntryBatch2,
      )
      expect(inMemoryBatchestocksRepository.items[2].quantity).toBe(
        quantityToEntryBatch3,
      )
    }
  })
})
