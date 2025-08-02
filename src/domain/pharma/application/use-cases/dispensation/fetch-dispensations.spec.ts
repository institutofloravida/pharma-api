import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { makeDispensation } from 'test/factories/make-dispensation'
import { FetchDispensationsUseCase } from './fetch-dispensation'
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
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { makeMedicineExit } from 'test/factories/make-medicine-exit'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { makeMovimentation } from 'test/factories/make-movimentation'
import { makeBatch } from 'test/factories/make-batch'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeStock } from 'test/factories/make-stock'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeInstitution } from 'test/factories/make-insitution'
import { makeMedicine } from 'test/factories/make-medicine'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'

let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
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
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryDispensationsRepository: InMemoryDispensationsMedicinesRepository
let inMemoryMovimentationRepository: InMemoryMovimentationRepository
let sut: FetchDispensationsUseCase
describe('Fetch Dispensations', () => {
  beforeEach(() => {
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
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
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

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )

    inMemoryMedicinesEntriesRepository = new InMemoryMedicinesEntriesRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )

    inMemoryMovimentationRepository.setEntriesRepository(inMemoryMedicinesEntriesRepository)
    inMemoryMovimentationRepository.setExitsRepository(inMemoryMedicinesExitsRepository)

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

    sut = new FetchDispensationsUseCase(inMemoryDispensationsRepository)
  })

  it('should be able to fetch dispensations', async () => {
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
      currentQuantity: 80,
    })
    const batch = makeBatch({
    })
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

    const dispensation = makeDispensation({
      patientId: patient.id,
      dispensationDate: new Date(2025, 2, 14),
      createdAt: new Date(),
      operatorId: operator.id,
    })

    await inMemoryDispensationsRepository.create(dispensation)

    const dispensation2 = makeDispensation({
      patientId: patient.id,
      dispensationDate: new Date(2025, 2, 14),
      createdAt: new Date(),
      operatorId: operator.id,
    })

    await inMemoryDispensationsRepository.create(dispensation2)

    const exit1 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      dispensationId: dispensation.id,
      stockId: stock.id,
    })

    const exit2 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      stockId: stock.id,
      dispensationId: dispensation2.id,
    })

    await Promise.all([
      inMemoryMedicinesExitsRepository.create(exit1),
      inMemoryMedicinesExitsRepository.create(exit2),
    ])

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,
        batchStockId: batchStock.id,
        movementTypeId: undefined,

        direction: 'EXIT',
        entryId: undefined,
        exitId: exit1.id,

      }),
    )
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        batchStockId: batchStock.id,
        movementTypeId: undefined,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit2.id,
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.dispensations).toHaveLength(2)
  })

  it('should be able to fetch paginated dispensations', async () => {
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
      currentQuantity: 80,
    })
    const batch = makeBatch({
    })
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
    const patient2 = makePatient()
    await inMemoryPatientsRepository.create(patient2)

    for (let i = 1; i <= 22; i++) {
      const dispensation = makeDispensation({
        patientId: i % 2 === 0
          ? patient.id
          : patient2.id,
        dispensationDate: new Date(2025, 2, 14),
        createdAt: new Date(),
        operatorId: operator.id,
      })

      await inMemoryDispensationsRepository.create(dispensation)

      const dispensation2 = makeDispensation({
        patientId: i % 2 === 1
          ? patient.id
          : patient2.id,
        dispensationDate: new Date(2025, 2, 14),
        createdAt: new Date(),
        operatorId: operator.id,
      })

      await inMemoryDispensationsRepository.create(dispensation2)

      const exit1 = makeMedicineExit({
        exitType: ExitType.DISPENSATION,
        operatorId: operator.id,
        dispensationId: dispensation.id,
        stockId: stock.id,
      })

      const exit2 = makeMedicineExit({
        exitType: ExitType.DISPENSATION,
        operatorId: operator.id,
        stockId: stock.id,
        dispensationId: dispensation2.id,
      })

      await Promise.all([
        inMemoryMedicinesExitsRepository.create(exit1),
        inMemoryMedicinesExitsRepository.create(exit2),
      ])

      await inMemoryMovimentationRepository.create(
        makeMovimentation({
          quantity: 10,
          batchStockId: batchStock.id,
          movementTypeId: undefined,

          direction: 'EXIT',
          entryId: undefined,
          exitId: exit1.id,

        }),
      )
      await inMemoryMovimentationRepository.create(
        makeMovimentation({
          quantity: 20,
          batchStockId: batchStock.id,
          movementTypeId: undefined,
          direction: 'EXIT',
          entryId: undefined,
          exitId: exit2.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 5,
    })

    const resultByPatientId = await sut.execute({
      page: 3,
      patientId: patient.id.toString(),
    })

    expect(result.value?.dispensations).toHaveLength(4)
    expect(resultByPatientId.value?.dispensations).toHaveLength(2)
  })
})
