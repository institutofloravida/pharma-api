import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { CreatePathologyUseCase } from './create-pathology'

let inMemoryPathologysRepository: InMemoryPathologiesRepository
let sut: CreatePathologyUseCase

describe('Pathology', () => {
  beforeEach(() => {
    inMemoryPathologysRepository = new InMemoryPathologiesRepository()
    sut = new CreatePathologyUseCase(inMemoryPathologysRepository)
  })
  it('shoult be able create a Pathology', async () => {
    const result = await sut.execute({
      content: 'Hipertensão',
      code: 'I10',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPathologysRepository.items).toHaveLength(1)
      expect(inMemoryPathologysRepository.items[0].content).toBe(result.value?.pathology.content)
      expect(inMemoryPathologysRepository.items[0].code).toBe('I10')
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'Aché',
      code: 'A001',
    })
    const result2 = await sut.execute({
      content: 'Aché',
      code: 'A002',
    })
    const result3 = await sut.execute({
      content: 'Astazeneca',
      code: 'A003',
    })
    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    expect(result3.isRight()).toBeTruthy()
    if (result.isRight() && result3.isRight()) {
      expect(inMemoryPathologysRepository.items).toHaveLength(2)
      expect(inMemoryPathologysRepository.items[0].id).toBe(result.value?.pathology.id)
      expect(inMemoryPathologysRepository.items[1].id).toBe(result3.value?.pathology.id)
    }
  })
})
