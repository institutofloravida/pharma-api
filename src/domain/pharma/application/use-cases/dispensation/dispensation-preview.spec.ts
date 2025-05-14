import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { DispensationPreviewUseCase } from './dispensation-preview'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let sut: DispensationPreviewUseCase

describe('Dispensation Preview', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
    inMemoryBatchesRepository = new InMemoryBatchesRepository()

    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      )
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
    inMemoryBatchStocksRepository.setMedicinesStockRepository(
      inMemoryMedicinesStockRepository,
    )

    sut = new DispensationPreviewUseCase(
      inMemoryMedicinesStockRepository,
      inMemoryBatchStocksRepository,
    )
  })
  it('should be able to return a dispensation preview', async () => {
    const dateBase = new Date('2025-01-01')
    vi.setSystemTime(dateBase)

    const quantityToDispense = 50

    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({ institutionId: institution.id })
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
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const batch1 = makeBatch({
      manufacturerId: manufacturer.id,
      code: 'ATE001',
      expirationDate: new Date('2025-03-31'),
    })

    const batch2 = makeBatch({
      manufacturerId: manufacturer.id,
      code: 'ATE002',
      expirationDate: new Date('2025-09-31'),
    })

    await Promise.all([
      inMemoryBatchesRepository.create(batch1),
      inMemoryBatchesRepository.create(batch2),
    ])

    const batcheStock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 15,
      medicineStockId: medicineStock.id,

    })

    const batcheStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 50,
      medicineStockId: medicineStock.id,
    })

    medicineStock.batchesStockIds = [batcheStock1.id, batcheStock2.id]
    medicineStock.quantity = batcheStock1.quantity + batcheStock2.quantity

    await Promise.all([
      inMemoryBatchStocksRepository.create(batcheStock1),
      inMemoryBatchStocksRepository.create(batcheStock2),
    ])

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineStockId: medicineStock.id.toString(),
      quantityRequired: quantityToDispense,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.batchesPreview).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            batchStockId: batcheStock1.id.toString(),
            code: 'ATE001',
            quantity: { toDispensation: batcheStock1.quantity, totalCurrent: batcheStock1.quantity },
          }),
          expect.objectContaining({
            batchStockId: batcheStock2.id.toString(),
            code: 'ATE002',
            quantity: {
              toDispensation: quantityToDispense - batcheStock1.quantity,
              totalCurrent: batcheStock2.quantity,
            },

          }),
        ]),
      )
    }
  })
  it('should not be able to return bacthesStock expirations', async () => {
    const dateBase = new Date('2025-01-01')
    vi.setSystemTime(dateBase)

    const quantityToDispense = 50

    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({ institutionId: institution.id })
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
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const batch1 = makeBatch({
      manufacturerId: manufacturer.id,
      code: 'ATE001',
      expirationDate: new Date('2025-03-31'),
    })

    const batch2 = makeBatch({
      manufacturerId: manufacturer.id,
      code: 'ATE002',
      expirationDate: new Date('2025-09-31'),
    })

    const batch3 = makeBatch({
      manufacturerId: manufacturer.id,
      code: 'ATE003',
      expirationDate: new Date('2024-12-15'),
    })

    await Promise.all([
      inMemoryBatchesRepository.create(batch1),
      inMemoryBatchesRepository.create(batch2),
      inMemoryBatchesRepository.create(batch3),
    ])

    const batcheStock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 15,
      medicineStockId: medicineStock.id,

    })

    const batcheStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 50,
      medicineStockId: medicineStock.id,
    })

    const batcheStock3 = makeBatchStock({
      batchId: batch3.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 50,
      medicineStockId: medicineStock.id,
    })

    medicineStock.batchesStockIds = [batcheStock1.id, batcheStock2.id, batcheStock3.id]
    medicineStock.quantity = batcheStock1.quantity + batcheStock2.quantity + batcheStock3.quantity

    await Promise.all([
      inMemoryBatchStocksRepository.create(batcheStock1),
      inMemoryBatchStocksRepository.create(batcheStock2),
      inMemoryBatchStocksRepository.create(batcheStock3),
    ])

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicineStockId: medicineStock.id.toString(),
      quantityRequired: quantityToDispense,
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.batchesPreview).toHaveLength(2)
      expect(result.value.batchesPreview).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            batchStockId: batcheStock1.id.toString(),
            code: 'ATE001',
            quantity: {
              toDispensation: batcheStock1.quantity,
              totalCurrent: batcheStock1.quantity,
            },
          }),
          expect.objectContaining({
            batchStockId: batcheStock2.id.toString(),
            code: 'ATE002',
            quantity:
            {
              totalCurrent: batcheStock2.quantity,
              toDispensation: quantityToDispense - batcheStock1.quantity,
            },
          }),
        ]),
      )
    }
  })
})
