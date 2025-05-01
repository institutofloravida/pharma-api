import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { FetchBatchesStockUseCase } from './fetch-batches-stock'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let inMemoryBatchesStockRepository: InMemoryBatchStocksRepository
let sut: FetchBatchesStockUseCase
describe('Fetch Batches on Stock', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )

    inMemoryBatchesRepository = new InMemoryBatchesRepository()

    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
    inMemoryBatchesRepository = new InMemoryBatchesRepository()

    inMemoryMedicinesVariantsRepository =
    new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )
    inMemoryBatchesStockRepository = new InMemoryBatchStocksRepository(
      inMemoryBatchesRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryStocksRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryPharmaceuticalFormsRepository,
    )
    inMemoryBatchesStockRepository = new InMemoryBatchStocksRepository(
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
      inMemoryBatchesStockRepository,
      inMemoryBatchesRepository,
      inMemoryManufacturersRepository,
    )
    inMemoryBatchesStockRepository.setMedicinesStockRepository(inMemoryMedicinesStockRepository)

    sut = new FetchBatchesStockUseCase(inMemoryBatchesStockRepository)
  })

  it('should be able to fetch batches on stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    await inMemoryMedicinesRepository.addMedicinesVariantsId(
      medicine.id.toString(),
      medicineVariant.id.toString(),
    )

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const batch = makeBatch({
      code: 'ABC01',
    })
    await inMemoryBatchesRepository.create(batch)

    const batch2 = makeBatch({
      code: 'ABC02',
    })
    await inMemoryBatchesRepository.create(batch2)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      createdAt: new Date(2024, 0, 29),
    })
    await inMemoryBatchesStockRepository.create(batchStock)
    const batchStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      createdAt: new Date(2024, 0, 20),
    })
    await inMemoryBatchesStockRepository.create(batchStock2)

    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock.id.toString(),
    )
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock2.id.toString(),
    )

    const result = await sut.execute({
      page: 1,
      medicineStockId: medicineStock.id.toString(),
      code: 'ABC',
    })

    expect(result.value?.batchesStock).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      ]),
    )
  })

  it('should be able to fetch paginated batches on stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    await inMemoryMedicinesRepository.addMedicinesVariantsId(
      medicine.id.toString(),
      medicineVariant.id.toString(),
    )

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)

    await Promise.all(
      Array.from({ length: 22 }).map(async () => {
        const batch = makeBatch()
        await inMemoryBatchesRepository.create(batch)

        const batchStock = makeBatchStock({
          batchId: batch.id,
          medicineVariantId: medicineVariant.id,
          medicineStockId: medicineStock.id,
          stockId: stock.id,
        })
        await inMemoryBatchesStockRepository.create(batchStock)

        await inMemoryMedicinesStockRepository.addBatchStock(
          medicineStock.id.toString(),
          batchStock.id.toString(),
        )
      }),
    )

    const result = await sut.execute({
      page: 3,
      medicineStockId: medicineStock.id.toString(),
    })

    expect(result.value?.batchesStock).toHaveLength(2)
  })

  it.todo('should not be able to fetch batches stocks with quantity less than or greater than zero', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    await inMemoryMedicinesRepository.addMedicinesVariantsId(
      medicine.id.toString(),
      medicineVariant.id.toString(),
    )

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 10,
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const batch = makeBatch({
      code: 'ABC01',
    })
    await inMemoryBatchesRepository.create(batch)

    const batch2 = makeBatch({
      code: 'ABC02',
    })
    await inMemoryBatchesRepository.create(batch2)

    const batchStock = makeBatchStock({
      currentQuantity: 10,
      batchId: batch.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      createdAt: new Date(2024, 0, 29),
    })
    await inMemoryBatchesStockRepository.create(batchStock)
    const batchStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      createdAt: new Date(2024, 0, 20),
      currentQuantity: 0,
    })
    await inMemoryBatchesStockRepository.create(batchStock2)

    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock.id.toString(),

    )
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock2.id.toString(),
    )

    const result = await sut.execute({
      page: 1,
      medicineStockId: medicineStock.id.toString(),
    })

    expect(result.value?.batchesStock).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ quantity: 10 }),
      ]),
    )
  })
})
