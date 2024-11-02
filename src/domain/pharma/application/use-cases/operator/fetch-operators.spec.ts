import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { FethOperatorsUseCase } from './fetch-operators'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryOperatorsRepository:InMemoryOperatorsRepository
let sut: FethOperatorsUseCase
describe('Fetch Operators', () => {
  beforeEach(() => {
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository()

    sut = new FethOperatorsUseCase(inMemoryOperatorsRepository)
  })

  it('should be able to fetch operators', async () => {
    await inMemoryOperatorsRepository.create(
      makeOperator({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryOperatorsRepository.create(
      makeOperator({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryOperatorsRepository.create(
      makeOperator({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.operators).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated  operators', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOperatorsRepository.create(makeOperator())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.operators).toHaveLength(2)
  })
})
