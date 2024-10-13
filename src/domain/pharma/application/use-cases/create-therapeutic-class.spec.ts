import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { CreateTherapeuticClassUseCase } from './create-therapeutic-class'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let sut: CreateTherapeuticClassUseCase

describe('Therapeutic Class', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    sut = new CreateTherapeuticClassUseCase(inMemoryTherapeuticClassesRepository)
  })
  it('shoult be able create a therapeuic class', async () => {
    const result = await sut.execute({
      content: 'antibiotic',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryTherapeuticClassesRepository.items).toHaveLength(1)
      expect(inMemoryTherapeuticClassesRepository.items[0].content).toBe(result.value?.therapeuticClass.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'antibiotic',
    })
    const result2 = await sut.execute({
      content: 'antibiotic',
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryTherapeuticClassesRepository.items).toHaveLength(1)
      expect(inMemoryTherapeuticClassesRepository.items[0].id).toBe(result.value?.therapeuticClass.id)
    }
  })
})
