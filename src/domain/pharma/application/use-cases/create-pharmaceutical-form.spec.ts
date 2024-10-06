import { InMemoryPharmaceuticalFormRepository } from 'test/repositories/in-memory-pharmaceutical-form'
import { CreatePharmaceuticalFormUseCase } from './create-pharmaceutical-form'

let inMemoryPharmaceuticalFormRepository: InMemoryPharmaceuticalFormRepository
let sut: CreatePharmaceuticalFormUseCase

describe('Pharmaceutical Form', () => {
  beforeEach(() => {
    inMemoryPharmaceuticalFormRepository = new InMemoryPharmaceuticalFormRepository()
    sut = new CreatePharmaceuticalFormUseCase(inMemoryPharmaceuticalFormRepository)
  })
  it('shoult be able create a pharmaceutical form', async () => {
    const result = await sut.execute({
      content: 'pills',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPharmaceuticalFormRepository.items).toHaveLength(1)
      expect(inMemoryPharmaceuticalFormRepository.items[0].content).toBe(result.value?.pharmaceuticalForm.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'pills',
    })
    const result2 = await sut.execute({
      content: 'pills',
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPharmaceuticalFormRepository.items).toHaveLength(1)
      expect(inMemoryPharmaceuticalFormRepository.items[0].id).toBe(result.value?.pharmaceuticalForm.id)
    }
  })
})
