import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { GetUnitMeasureUseCase } from './get-unit-measure'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'

let inMemoryUnitsMeasureRepository:InMemoryUnitsMeasureRepository
let sut: GetUnitMeasureUseCase
describe('Get Unit Measure', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()

    sut = new GetUnitMeasureUseCase(inMemoryUnitsMeasureRepository)
  })

  it('should be able to get a unit measure', async () => {
    const unitmeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitmeasure)

    const result = await sut.execute({
      id: unitmeasure.id.toString(),
    })

    expect(result.value).toEqual(expect.objectContaining({
      content: unitmeasure.content,
      acronym: unitmeasure.acronym,
    }))
  })
})
