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
  it('shoul be able create a unit measure', async () => {
    const result = await sut.execute({
      acronym: 'cx',
      content: 'caixa',
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryUnitMeasureRepository.items).toHaveLength(1)
    expect(inMemoryUnitMeasureRepository.items[0].acronym).toBe(result.value?.unitMeasure.acronym)
  })
})
