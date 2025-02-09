import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { FetchBatchesUseCase } from './fetch-batches'
import { makeBatch } from 'test/factories/make-batch'

let inMemoryBatchesRepository:InMemoryBatchesRepository
let sut: FetchBatchesUseCase
describe('Fetch Batches', () => {
  beforeEach(() => {
    inMemoryBatchesRepository = new InMemoryBatchesRepository()

    sut = new FetchBatchesUseCase(inMemoryBatchesRepository)
  })

  it('should be able to fetch batches', async () => {
    await inMemoryBatchesRepository.create(
      makeBatch({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryBatchesRepository.create(
      makeBatch({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryBatchesRepository.create(
      makeBatch({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.batches).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated batches', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryBatchesRepository.create(makeBatch())
    }

    const result = await sut.execute({
      page: 3,
    })

    expect(result.value?.batches).toHaveLength(2)
  })
})
