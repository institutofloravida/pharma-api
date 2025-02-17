import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { FethOperatorsUseCase } from './fetch-operators'
import { makeOperator } from 'test/factories/make-operator'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'

let inMemoryInstitutionsRepository:InMemoryInstitutionsRepository
let inMemoryOperatorsRepository:InMemoryOperatorsRepository
let sut: FethOperatorsUseCase
describe('Fetch Operators', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(inMemoryInstitutionsRepository)

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

  it('should be able to fetch paginated operators', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOperatorsRepository.create(makeOperator())
    }

    const result = await sut.execute({
      page: 3,
    })

    expect(result.value?.operators).toHaveLength(2)
  })
})
