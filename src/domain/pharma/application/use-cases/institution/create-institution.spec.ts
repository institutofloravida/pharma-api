import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { CreateInstitutionUseCase } from './create-institution'
import { InstitutionType } from '@/domain/pharma/enterprise/entities/institution'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let sut: CreateInstitutionUseCase

describe('Institution', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    sut = new CreateInstitutionUseCase(inMemoryInstitutionsRepository)
  })
  it('shoult be able create a Institution', async () => {
    const result = await sut.execute({
      content: 'Ubs module-20',
      cnpj: '1234567890',
      description: 'lorem ipsum tarara',
      controlStock: true,
      responsible: 'John Doe',
      type: InstitutionType.ONG
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryInstitutionsRepository.items).toHaveLength(1)
      expect(inMemoryInstitutionsRepository.items[0].content).toBe(result.value?.institution.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'Ubs module-20',
      cnpj: '1234567890',
      controlStock: true,
      responsible: 'John Doe',
      type: InstitutionType.ONG
    })
    const result2 = await sut.execute({
      content: 'Ubs module-20',
      cnpj: '1234567890',
      controlStock: true,
      responsible: 'Maria',
      type: InstitutionType.PRIVATE
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryInstitutionsRepository.items).toHaveLength(1)
      expect(inMemoryInstitutionsRepository.items[0].id).toBe(result.value?.institution.id)
      expect(inMemoryInstitutionsRepository.items[0].description).toBeUndefined()
    }
  })
})
