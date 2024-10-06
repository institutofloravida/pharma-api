import { InMemoryUnitMeasureRepository }
  from 'test/repositories/in-memory-unit-measure-repository'
import { CreateUnitMeasureUseCase } from './create-unit-measure'

let inMemoryUnitMeasureRepository: InMemoryUnitMeasureRepository
let sut: CreateUnitMeasureUseCase

describe('Unit Measures', () => {
  beforeEach(() => {
    inMemoryUnitMeasureRepository = new InMemoryUnitMeasureRepository()
    sut = new CreateUnitMeasureUseCase(inMemoryUnitMeasureRepository)
  })
  it('shoult be able create a unit measure', async () => {
    const result = await sut.execute({
      acronym: 'bx',
      content: 'box',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUnitMeasureRepository.items).toHaveLength(1)
      expect(inMemoryUnitMeasureRepository.items[0].acronym).toBe(result.value?.unitMeasure.acronym)
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
      expect(inMemoryUnitMeasureRepository.items).toHaveLength(1)
      expect(inMemoryUnitMeasureRepository.items[0].id).toBe(result.value?.unitMeasure.id)
    }
  })
})
