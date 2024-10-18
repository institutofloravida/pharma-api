import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { CreatePharmaceuticalFormUseCase } from './create-pharmaceutical-form'

let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let sut: CreatePharmaceuticalFormUseCase

describe('Pharmaceutical Form', () => {
  beforeEach(() => {
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    sut = new CreatePharmaceuticalFormUseCase(inMemoryPharmaceuticalFormsRepository)
  })
  it('shoult be able create a pharmaceutical form', async () => {
    const result = await sut.execute({
      content: 'pills',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPharmaceuticalFormsRepository.items).toHaveLength(1)
      expect(inMemoryPharmaceuticalFormsRepository.items[0].content).toBe(result.value?.pharmaceuticalForm.content)
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
      expect(inMemoryPharmaceuticalFormsRepository.items).toHaveLength(1)
      expect(inMemoryPharmaceuticalFormsRepository.items[0].id).toBe(result.value?.pharmaceuticalForm.id)
    }
  })
})
