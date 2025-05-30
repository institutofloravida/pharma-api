import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { CreateMedicineStockUseCase } from './create-medicine-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository

let sut: CreateMedicineStockUseCase

describe('Medicine Stock', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      )
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()

    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository(
      inMemoryBatchesRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryStocksRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryPharmaceuticalFormsRepository,
    )
    inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository(
      inMemoryInstitutionsRepository,
      inMemoryStocksRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
      inMemoryManufacturersRepository,
    )
    inMemoryBatchStocksRepository.setMedicinesStockRepository(inMemoryMedicinesStockRepository)

    sut = new CreateMedicineStockUseCase(
      inMemoryStocksRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryBatchesRepository,
      inMemoryBatchStocksRepository,
      inMemoryMedicinesStockRepository,
    )
  })
  it('shoult be able create a medicine stock', async () => {
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].quantity).toBe(
        result.value?.medicineStock.quantity,
      )
    }
  })
  it('not should allowed duplicity', async () => {
    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicineVariant = makeMedicineVariant()
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    const result2 = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineVariantId: medicineVariant.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesStockRepository.items[0].id).toBe(
        result.value?.medicineStock.id,
      )
    }
  })
})
