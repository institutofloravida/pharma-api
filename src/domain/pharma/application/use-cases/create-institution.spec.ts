import { InMemoryInstitutionRepository } from 'test/repositories/in-memory-institution'
import { CreateInstitutionUseCase } from './create-institution'

let inMemoryInstitutionRepository: InMemoryInstitutionRepository
let sut: CreateInstitutionUseCase

describe('Institution', () => {
  beforeEach(() => {
    inMemoryInstitutionRepository = new InMemoryInstitutionRepository()
    sut = new CreateInstitutionUseCase(inMemoryInstitutionRepository)
  })
  it('shoult be able create a Institution', async () => {
    const result = await sut.execute({
      content: 'Ubs module-20',
      cnpj: '1234567890',
      description: 'lorem ipsum tarara',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryInstitutionRepository.items).toHaveLength(1)
      expect(inMemoryInstitutionRepository.items[0].content).toBe(result.value?.institution.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'Ubs module-20',
      cnpj: '1234567890',
    })
    const result2 = await sut.execute({
      content: 'Ubs module-20',
      cnpj: '1234567890',
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryInstitutionRepository.items).toHaveLength(1)
      expect(inMemoryInstitutionRepository.items[0].id).toBe(result.value?.institution.id)
      expect(inMemoryInstitutionRepository.items[0].description).toBeNull()
    }
  })
})
