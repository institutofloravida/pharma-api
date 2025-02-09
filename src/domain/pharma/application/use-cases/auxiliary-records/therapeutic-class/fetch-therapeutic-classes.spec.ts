import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { FetchTherapeuticClassesUseCase } from './fetch-therapeutic-classes'
import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let sut: FetchTherapeuticClassesUseCase
describe('Fetch TherapeuticClasses', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()

    sut = new FetchTherapeuticClassesUseCase(inMemoryTherapeuticClassesRepository)
  })

  it('should be able to fetch therapeutic classes', async () => {
    await inMemoryTherapeuticClassesRepository.create(
      makeTherapeuticClass({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryTherapeuticClassesRepository.create(
      makeTherapeuticClass({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryTherapeuticClassesRepository.create(
      makeTherapeuticClass({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.therapeuticClasses).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated therapeutic classes', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryTherapeuticClassesRepository.create(makeTherapeuticClass({ content: `therapeutic class ${i}` }))
    }

    const result = await sut.execute({
      page: 3,
      content: 'therapeutic class',
    })

    expect(result.value?.therapeuticClasses).toHaveLength(2)
  })
})
