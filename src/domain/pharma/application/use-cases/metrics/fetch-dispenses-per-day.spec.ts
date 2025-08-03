import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { makeDispensation } from 'test/factories/make-dispensation'
import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeOperator } from 'test/factories/make-operator'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { FetchDispensesPerDayUseCase } from './fetch-dispenses-per-day'
import { makeInstitution } from 'test/factories/make-insitution'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeMedicineExit } from 'test/factories/make-medicine-exit'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeStock } from 'test/factories/make-stock'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository'
import { makeMovimentation } from 'test/factories/make-movimentation'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'

let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let inMemoryMovimentationRepository: InMemoryMovimentationRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryDispensationsRepository: InMemoryDispensationsMedicinesRepository
let sut: FetchDispensesPerDayUseCase
describe('Fetch Dispenses Per Day', () => {
  beforeEach(() => {
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
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
    inMemoryPatientsRepository = new InMemoryPatientsRepository(
      inMemoryAddressRepository,
      inMemoryPathologiesRepository,
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

    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
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

    sut = new FetchDispensesPerDayUseCase(inMemoryDispensationsRepository)
  })

  it('should be able to fetch dispenses per day', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      batchesStockIds: [],
      currentQuantity: 50,
    })
    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 80,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      medicineStockId: medicineStock.id,
    })
    await inMemoryBatchStocksRepository.create(batchStock)

    medicineStock.addBatchStockId(batchStock.id)

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const [dispensation1, dispensation2, dispensation3] = [
      makeDispensation({
        createdAt: new Date(2024, 0, 20),
        operatorId: operator.id,
        patientId: patient.id,
        dispensationDate: new Date(2024, 0, 20),

      }),
      makeDispensation({
        createdAt: new Date(2024, 0, 27),
        operatorId: operator.id,
        patientId: patient.id,
        dispensationDate: new Date(2024, 0, 27),
      }),
      makeDispensation({
        createdAt: new Date(2024, 0, 29),
        operatorId: operator.id,
        patientId: patient.id,
        dispensationDate: new Date(2024, 0, 29),
      }),
    ]

    await Promise.all([
      inMemoryDispensationsRepository.create(dispensation1),
      inMemoryDispensationsRepository.create(dispensation2),
      inMemoryDispensationsRepository.create(dispensation3),
    ])

    const exit1 = makeMedicineExit({
      operatorId: operator.id,
      stockId: stock.id,
      exitType: ExitType.DISPENSATION,
      dispensationId: dispensation1.id,
    })

    const exit2 = makeMedicineExit({
      operatorId: operator.id,
      stockId: stock.id,
      exitType: ExitType.DISPENSATION,
      dispensationId: dispensation2.id,
    })

    const exit3 = makeMedicineExit({
      operatorId: operator.id,
      stockId: stock.id,
      exitType: ExitType.DISPENSATION,
      dispensationId: dispensation3.id,
    })

    await Promise.all([
      inMemoryMedicinesExitsRepository.create(exit1),
      inMemoryMedicinesExitsRepository.create(exit2),
      inMemoryMedicinesExitsRepository.create(exit3),
    ])

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,

        movementTypeId: undefined,
        batchStockId: batchStock.id,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit1.id,
      }),
    )
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        movementTypeId: undefined,
        batchStockId: batchStock.id,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit2.id,
      }),
    )
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 30,
        movementTypeId: undefined,
        batchStockId: batchStock.id,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit3.id,
      }),
    )

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      startDate: new Date(2024, 0, 20),
      endDate: new Date(2024, 0, 29),
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value?.dispenses).toHaveLength(3)
  })
})
