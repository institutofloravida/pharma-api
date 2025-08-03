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
import { FetchMostTreatedPathologiesUseCase } from './fetch-most-treated-pathologies'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { makePathology } from 'test/factories/make-pathology'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository'
import { makeMovimentation } from 'test/factories/make-movimentation'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'

let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryMovimentationRepository: InMemoryMovimentationRepository
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
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let sut: FetchMostTreatedPathologiesUseCase
describe('Fetch Most Treated Pathologies', () => {
  beforeEach(() => {
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
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
    inMemoryAddressRepository = new InMemoryAddressRepository()
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

    sut = new FetchMostTreatedPathologiesUseCase(
      inMemoryDispensationsRepository,
    )
  })

  it('should be able to fetch most treated pathologies', async () => {
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

    const pathology = makePathology()
    await inMemoryPathologiesRepository.create(pathology)
    const pathology2 = makePathology()
    await inMemoryPathologiesRepository.create(pathology2)
    const pathology3 = makePathology()
    await inMemoryPathologiesRepository.create(pathology3)
    const pathology4 = makePathology()
    await inMemoryPathologiesRepository.create(pathology4)
    const pathology5 = makePathology()
    await inMemoryPathologiesRepository.create(pathology5)
    const pathology6 = makePathology()
    await inMemoryPathologiesRepository.create(pathology6)

    const patient = makePatient({
      pathologiesIds: [pathology.id, pathology2.id, pathology3.id],
    })
    await inMemoryPatientsRepository.create(patient)

    const patient2 = makePatient({
      pathologiesIds: [pathology.id, pathology4.id, pathology5.id, pathology6.id],
    })
    await inMemoryPatientsRepository.create(patient2)

    const patient3 = makePatient({
      pathologiesIds: [pathology.id],
    })
    await inMemoryPatientsRepository.create(patient3)

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
        patientId: patient2.id,
        dispensationDate: new Date(2024, 0, 27),
      }),
      makeDispensation({
        createdAt: new Date(2024, 0, 29),
        operatorId: operator.id,
        patientId: patient3.id,
        dispensationDate: new Date(2024, 0, 29),
      }),
    ]

    await Promise.all([
      inMemoryDispensationsRepository.create(dispensation1),
      inMemoryDispensationsRepository.create(dispensation2),
      inMemoryDispensationsRepository.create(dispensation3),
    ])

    const exit1 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      stockId: stock.id,
      dispensationId: dispensation1.id,
    })

    const exit2 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      stockId: stock.id,
      dispensationId: dispensation2.id,
    })
    const exit3 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      stockId: stock.id,
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
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 30,
        batchStockId: batchStock.id,

        movementTypeId: undefined,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit3.id,
      }),
    )

    const result = await sut.execute({
      institutionId: institution.id.toString(),
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value?.mostTreatedPathologies).toHaveLength(5)
    expect(result.value?.mostTreatedPathologies[0]).toEqual(
      expect.objectContaining({
        pathologyId: pathology.id.toString(),
        pathologyName: pathology.content,
        total: 3,
        percentage: 37.5,
      }),
    )
  })
})
