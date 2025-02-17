import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { makePatient } from 'test/factories/make-patient'
import { FetchPatientsUseCase } from './fetch-pacients'
import { makePathology } from 'test/factories/make-pathology'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'

let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let sut: FetchPatientsUseCase
describe('Fetch Patients', () => {
  beforeEach(() => {
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
    inMemoryPatientsRepository = new InMemoryPatientsRepository()

    sut = new FetchPatientsUseCase(inMemoryPatientsRepository)
  })

  it('should be able to fetch patients', async () => {
    const pathology = makePathology()
    await inMemoryPathologiesRepository.create(pathology)

    await inMemoryPatientsRepository.create(
      makePatient({
        createdAt: new Date(2024, 0, 29),
        name: 'Name Test',
        sus: '123456789012',
        cpf: '12345678910',
        birthDate: new Date('2020-01-01'),
        generalRegistration: '1234567',
        pathologiesIds: [pathology.id],
      }),
    )
    await inMemoryPatientsRepository.create(
      makePatient({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryPatientsRepository.create(
      makePatient({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    const result2 = await sut.execute({
      page: 1,
      content: 'Test',
      sus: '123456789012',
      birthDate: new Date('2020-01-01'),
      cpf: '12345678910',
      generalRegistration: '12345678910',
      pathologyId: pathology.id.toString(),
    })

    expect(result.value?.patients).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
    if (result2.isRight()) {
      expect(result2.value.patients).toHaveLength(1)
    }
  })

  it('should be able to fetch paginated patients', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryPatientsRepository.create(makePatient())
    }

    const result = await sut.execute({
      page: 3,
    })

    expect(result.value?.patients).toHaveLength(2)
  })
})
