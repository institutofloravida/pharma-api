import { InMemoryTherapeuticClassRepository } from 'test/repositories/in-memory-therapeutic-class-repository'
import { CreateTherapeuticClassUseCase } from './create-therapeutic-class'

let inMemoryTherapeuticClassRepository: InMemoryTherapeuticClassRepository
let sut: CreateTherapeuticClassUseCase

describe('Therapeutic Class', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassRepository = new InMemoryTherapeuticClassRepository()
    sut = new CreateTherapeuticClassUseCase(inMemoryTherapeuticClassRepository)
  })
  it('shoult be able create a therapeuic class', async () => {
    const result = await sut.execute({
      content: 'antibiotic',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryTherapeuticClassRepository.items).toHaveLength(1)
      expect(inMemoryTherapeuticClassRepository.items[0].content).toBe(result.value?.therapeuticClass.content)
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
      expect(inMemoryTherapeuticClassRepository.items).toHaveLength(1)
      expect(inMemoryTherapeuticClassRepository.items[0].id).toBe(result.value?.therapeuticClass.id)
    }
  })
})
