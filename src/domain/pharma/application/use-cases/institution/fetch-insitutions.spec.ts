import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { FethInstitutionsUseCase } from './fetch-institutions'
import { makeInstitution } from 'test/factories/make-insitution'

let inMemoryInstitutionsRepository:InMemoryInstitutionsRepository
let sut: FethInstitutionsUseCase
describe('Fetch Institutions', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    sut = new FethInstitutionsUseCase(inMemoryInstitutionsRepository)
  })

  it('should be able to fetch institutions', async () => {
    await inMemoryInstitutionsRepository.create(
      makeInstitution({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryInstitutionsRepository.create(
      makeInstitution({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryInstitutionsRepository.create(
      makeInstitution({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.institutions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated institutions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryInstitutionsRepository.create(makeInstitution({
        cnpj: `111111111111${String(i).padStart(2, '0')}`,
      }))
    }

    const result = await sut.execute({
      page: 1,
      cnpj: '11111111111121',
    })

    expect(result.value?.institutions).toHaveLength(1)
  })
})
