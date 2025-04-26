import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { makeDispensation } from 'test/factories/make-dispensation'
import { FetchDispensationsUseCase } from './fetch-dispensation'
import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryDispensationsRepository: InMemoryDispensationsMedicinesRepository
let sut: FetchDispensationsUseCase
describe('Fetch Dispensations', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    inMemoryPatientsRepository = new InMemoryPatientsRepository()
    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository()
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
