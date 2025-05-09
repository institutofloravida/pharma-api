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
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
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
let sut: FetchDispensationsUseCase
describe('Fetch Dispensations', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()

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
    inMemoryPatientsRepository = new InMemoryPatientsRepository()
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
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
      inMemoryOperatorsRepository,
      inMemoryMovementTypesRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryStocksRepository,
      inMemoryMedicinesStockRepository,
    )
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryDispensationsRepository =
      new InMemoryDispensationsMedicinesRepository(
        inMemoryMedicinesExitsRepository,
        inMemoryOperatorsRepository,
        inMemoryPatientsRepository,
      )

    sut = new FetchDispensationsUseCase(inMemoryDispensationsRepository)
  })

  it('should be able to fetch dispensations', async () => {
    const operator = makeOperator()
    await inMemoryOperatorsRepository.create(operator)

    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    await inMemoryDispensationsRepository.create(
      makeDispensation({
        createdAt: new Date(2024, 0, 29),
        operatorId: operator.id,
        patientId: patient.id,
      }),
    )
    await inMemoryDispensationsRepository.create(
      makeDispensation({
        createdAt: new Date(2024, 0, 20),
        operatorId: operator.id,
        patientId: patient.id,
      }),
    )
    await inMemoryDispensationsRepository.create(
      makeDispensation({
        createdAt: new Date(2024, 0, 27),
        operatorId: operator.id,
        patientId: patient.id,
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.dispensations).toHaveLength(3)
  })

  it('should be able to fetch paginated dispensations', async () => {
    const operator = makeOperator()
    await inMemoryOperatorsRepository.create(operator)

    const patient1 = makePatient()
    await inMemoryPatientsRepository.create(patient1)

    const patient2 = makePatient()
    await inMemoryPatientsRepository.create(patient2)

    for (let i = 1; i <= 22; i++) {
      await inMemoryDispensationsRepository.create(
        makeDispensation({
          patientId: patient1.id,
          operatorId: operator.id,
        }),
      )
    }

    for (let i = 1; i <= 11; i++) {
      await inMemoryDispensationsRepository.create(
        makeDispensation({
          patientId: patient2.id,
          operatorId: operator.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 4,
    })

    const resultByPatientId = await sut.execute({
      page: 3,
      patientId: patient1.id.toString(),
    })

    expect(result.value?.dispensations).toHaveLength(3)
    expect(resultByPatientId.value?.dispensations).toHaveLength(2)
  })
})
