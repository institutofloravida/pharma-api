import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { FetchUnitsMeasureUseCase } from './fetch-units-measure'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let sut: FetchUnitsMeasureUseCase
describe('Fetch Units Measure', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()

    sut = new FetchUnitsMeasureUseCase(inMemoryUnitsMeasureRepository)
  })

  it('should be able to fetch units measure', async () => {
    await inMemoryUnitsMeasureRepository.create(
      makeUnitMeasure({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryUnitsMeasureRepository.create(
      makeUnitMeasure({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryUnitsMeasureRepository.create(
      makeUnitMeasure({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.unitsMeasure).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated units measure', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryUnitsMeasureRepository.create(makeUnitMeasure())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.unitsMeasure).toHaveLength(2)
  })
})
