import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { FetchMovementTypesUseCase } from './fetch-movement-type'
import { makeMovementType } from 'test/factories/make-movement-type'

let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let sut: FetchMovementTypesUseCase
describe('Fetch Movement Types', () => {
  beforeEach(() => {
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()

    sut = new FetchMovementTypesUseCase(inMemoryMovementTypesRepository)
  })

  it('should be able to fetch movement types', async () => {
    await inMemoryMovementTypesRepository.create(
      makeMovementType({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryMovementTypesRepository.create(
      makeMovementType({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryMovementTypesRepository.create(
      makeMovementType({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.movementTypes).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated movement types', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryMovementTypesRepository.create(makeMovementType({
        content: `pathology entry ${i}`,
        direction: 'ENTRY',
      }))
    }
    for (let i = 1; i <= 5; i++) {
      await inMemoryMovementTypesRepository.create(makeMovementType({
        content: `pathology exit ${i}`,
        direction: 'EXIT',
      }))
    }

    const result = await sut.execute({
      page: 3,
    })
    const result2 = await sut.execute({
      page: 3,
      content: 'pathology',
      direction: 'ENTRY',
    })

    expect(result.value?.movementTypes).toHaveLength(7)
    expect(result2.value?.movementTypes).toHaveLength(2)
  })
})
