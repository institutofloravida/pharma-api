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
import { GetMedicineInventoryDetailsUseCase } from './get-medicine-inventory'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { makeBatchStock } from 'test/factories/make-batch-stock'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let sut: GetMedicineInventoryDetailsUseCase
describe('Inventory Medicine Details', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    vi.useFakeTimers()
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
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

    sut = new GetMedicineInventoryDetailsUseCase(
      inMemoryMedicinesStockRepository,
    )
  })

  it('should be able to inventory medicine details', async () => {
    const date = new Date(2025, 0, 1)
    vi.setSystemTime(date)

    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

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
      currentQuantity: 20,
      createdAt: new Date(2024, 0, 20),
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const batch = makeBatch({
      manufacturerId: manufacturer.id,
      expirationDate: new Date(2025, 6, 31),
      manufacturingDate: new Date(2024, 0, 1),
      code: 'ABC01',
    })
    await inMemoryBatchesRepository.create(batch)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      medicineStockId: medicineStock.id,
      currentQuantity: 20,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    await inMemoryBatchStocksRepository.create(batchStock)

    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock.id.toString(),
    )

    vi.setSystemTime(new Date(2025, 6, 5))

    const result = await sut.execute({
      medicineStockId: medicineStock.id.toString(),
    })
    expect(result.value?.medicineStockInventory).toEqual(
      expect.objectContaining({
        medicine: medicine.content,
        pharmaceuticalForm: pharmaceuticalForm.content,
        unitMeasure: unitMeasure.acronym,
        dosage: medicineVariant.dosage,
        minimumLevel: medicineStock.minimumLevel,
        batchesStock: expect.arrayContaining([
          expect.objectContaining({
            code: batch.code,
            quantity: 20,
            expirationDate: batch.expirationDate,
            manufacturingDate: batch.manufacturingDate,
            manufacturer: manufacturer.content,
            isCloseToExpiration: true,
            isExpired: false,
          })],
        ),
      }),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })
})
