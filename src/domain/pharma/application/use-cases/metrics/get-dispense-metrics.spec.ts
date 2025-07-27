import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { makePatient } from 'test/factories/make-patient'
import { makeDispensation } from 'test/factories/make-dispensation'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeStock } from 'test/factories/make-stock'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { GetDispenseMetricsUseCase } from './get-dispense-metrics'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'

let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryMovimentationRepository: InMemoryMovimentationRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
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
let inMemoryDispensationsRepository: InMemoryDispensationsMedicinesRepository
let sut: GetDispenseMetricsUseCase

describe('Get Metrics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()

    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()

    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
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
    inMemoryBatchStocksRepository.setMedicinesStockRepository(
      inMemoryMedicinesStockRepository,
    )

    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMovimentationRepository = new InMemoryMovimentationRepository(
      inMemoryOperatorsRepository,
      inMemoryMedicinesStockRepository,
      inMemoryStocksRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryBatchesRepository,
      inMemoryBatchStocksRepository,
      inMemoryMovementTypesRepository,
    )

    inMemoryMedicinesEntriesRepository = new InMemoryMedicinesEntriesRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )

    inMemoryMovimentationRepository.setEntriesRepository(inMemoryMedicinesEntriesRepository)
    inMemoryMovimentationRepository.setExitsRepository(inMemoryMedicinesExitsRepository)

    inMemoryPatientsRepository = new InMemoryPatientsRepository(
      inMemoryAddressRepository,
      inMemoryPathologiesRepository,
    )
    inMemoryDispensationsRepository =
      new InMemoryDispensationsMedicinesRepository(
        inMemoryMedicinesExitsRepository,
        inMemoryOperatorsRepository,
        inMemoryPatientsRepository,
        inMemoryMedicinesStockRepository,
        inMemoryStocksRepository,
        inMemoryPathologiesRepository,
        inMemoryMedicinesRepository,
        inMemoryMedicinesVariantsRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
        inMemoryMovimentationRepository,
        inMemoryBatchStocksRepository,
      )

    inMemoryPatientsRepository.setDispensationsRepository(
      inMemoryDispensationsRepository,
    )

    sut = new GetDispenseMetricsUseCase(inMemoryDispensationsRepository)
  })

  it('should be able to get Dispense Metrics', async () => {
    const date = new Date(2025, 2, 1)
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
    })
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const batch = makeBatch({
      code: 'ABC01',
      manufacturerId: manufacturer.id,
    })
    await inMemoryBatchesRepository.create(batch)

    const batch2 = makeBatch({
      code: 'ABC02',
      manufacturerId: manufacturer.id,
    })
    await inMemoryBatchesRepository.create(batch2)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      createdAt: new Date(2024, 0, 29),
      currentQuantity: 10,
    })
    await inMemoryBatchStocksRepository.create(batchStock)
    const batchStock2 = makeBatchStock({
      batchId: batch2.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      createdAt: new Date(2024, 0, 20),
      currentQuantity: 10,
    })
    await inMemoryBatchStocksRepository.create(batchStock2)

    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock.id.toString(),
    )
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchStock2.id.toString(),
    )
    const patient = makePatient({})
    await inMemoryPatientsRepository.create(patient)

    const dispensation = makeDispensation({
      patientId: patient.id,
      dispensationDate: new Date(2025, 2, 14),
      createdAt: new Date(),
    })

    await inMemoryDispensationsRepository.create(dispensation)

    const dispensation2 = makeDispensation({
      patientId: patient.id,
      dispensationDate: new Date(2025, 2, 14),
      createdAt: new Date(),
    })

    await inMemoryDispensationsRepository.create(dispensation2)

    const todayDate = new Date(2025, 2, 14)
    vi.setSystemTime(todayDate)

    const result = await sut.execute({
      institutionId: institution.id.toString(),
    })
    expect(result.value).toEqual(
      expect.objectContaining({
        dispense: {
          today: {
            total: 2,
            percentageAboveAverage: 100,
          },
          month: {
            total: 2,
            percentageComparedToLastMonth: 100,
          },
        },
      }),
    )
  })
})
