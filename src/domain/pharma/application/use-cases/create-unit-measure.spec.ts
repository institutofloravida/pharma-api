import { InMemoryUnitsMeasureRepository }
  from 'test/repositories/in-memory-units-measure-repository'
import { CreateUnitMeasureUseCase } from './create-unit-measure'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let sut: CreateUnitMeasureUseCase

describe('Unit Measures', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    sut = new CreateUnitMeasureUseCase(inMemoryUnitsMeasureRepository)
  })
  it('shoult be able create a unit measure', async () => {
    const result = await sut.execute({
      acronym: 'bx',
      content: 'box',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUnitsMeasureRepository.items).toHaveLength(1)
      expect(inMemoryUnitsMeasureRepository.items[0].acronym).toBe(result.value?.unitMeasure.acronym)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      acronym: 'bx',
      content: 'box',
    })
    const result2 = await sut.execute({
      acronym: 'bx',
      content: 'box',
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUnitsMeasureRepository.items).toHaveLength(1)
      expect(inMemoryUnitsMeasureRepository.items[0].id).toBe(result.value?.unitMeasure.id)
    }
  })
})
