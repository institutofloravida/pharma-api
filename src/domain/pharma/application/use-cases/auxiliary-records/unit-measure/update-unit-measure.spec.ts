import { UpdateUnitMeasureUseCase } from './update-unit-measure'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { UnitMeasureWithSameContentAlreadyExistsError } from './_errors/unit-measure-with-content-already-exists-error'
import { UnitMeasureWithSameAcronymAlreadyExistsError } from './_errors/unit-measure-with-acronym-already-exists-error'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'

let inMemoryUnitMeasuresRepository: InMemoryUnitsMeasureRepository
let sut: UpdateUnitMeasureUseCase

describe('Update Unit Measure', () => {
  beforeEach(() => {
    inMemoryUnitMeasuresRepository = new InMemoryUnitsMeasureRepository()
    sut = new UpdateUnitMeasureUseCase(inMemoryUnitMeasuresRepository)
  })
  it('shoult be able update a Unit Measure', async () => {
    const unitMeasure = makeUnitMeasure({
      content: 'unit measure 1',
    })
    await inMemoryUnitMeasuresRepository.create(unitMeasure)

    const result = await sut.execute({
      content: 'unit measure 2',
      unitmeasureId: unitMeasure.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryUnitMeasuresRepository.items).toHaveLength(1)
      expect(inMemoryUnitMeasuresRepository.items[0].content).toBe('unit measure 2')
    }
  })

  it('not should allowed duplicity', async () => {
    const unitmeasure = makeUnitMeasure({
      content: 'unitmeasure 1',
      acronym: 'UM1',
    })
    const unitmeasure2 = makeUnitMeasure({
      content: 'unitmeasure 2',
      acronym: 'UM2',
    })
    await inMemoryUnitMeasuresRepository.create(unitmeasure)
    await inMemoryUnitMeasuresRepository.create(unitmeasure2)

    const result1 = await sut.execute({
      unitmeasureId: unitmeasure.id.toString(),
      content: unitmeasure2.content,
    })

    const result2 = await sut.execute({
      unitmeasureId: unitmeasure.id.toString(),
      acronym: unitmeasure2.acronym,
    })

    expect(result1.isLeft()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result1.isLeft() && result2.isLeft()) {
      expect(result1.value).toBeInstanceOf(UnitMeasureWithSameContentAlreadyExistsError)
      expect(result2.value).toBeInstanceOf(UnitMeasureWithSameAcronymAlreadyExistsError)
    }
  })
})
