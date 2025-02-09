import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { FetchPathologiesUseCase } from '../pathology/fetch-pathologies'
import { makePathology } from 'test/factories/make-pathology'

let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let sut: FetchPathologiesUseCase
describe('Fetch manufatureres', () => {
  beforeEach(() => {
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()

    sut = new FetchPathologiesUseCase(inMemoryPathologiesRepository)
  })

  it('should be able to fetch pathologies', async () => {
    await inMemoryPathologiesRepository.create(
      makePathology({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryPathologiesRepository.create(
      makePathology({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryPathologiesRepository.create(
      makePathology({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.pathologies).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated pathologies', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryPathologiesRepository.create(makePathology({
        content: `pathology ${i}`,
      }))
    }

    const result = await sut.execute({
      page: 3,
    })
    const result2 = await sut.execute({
      page: 1,
      content: 'pathology 9',
    })

    expect(result.value?.pathologies).toHaveLength(2)
    expect(result2.value?.pathologies).toHaveLength(1)
  })
})
