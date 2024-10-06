import { InMemoryManufacturerRepository } from 'test/repositories/in-memory-manufacturer-repository'
import { CreateManufacturerUseCase } from './create-manufacturer'

let inMemoryManufacturerRepository: InMemoryManufacturerRepository
let sut: CreateManufacturerUseCase

describe('Manufacturer', () => {
  beforeEach(() => {
    inMemoryManufacturerRepository = new InMemoryManufacturerRepository()
    sut = new CreateManufacturerUseCase(inMemoryManufacturerRepository)
  })
  it('shoult be able create a Manufacturer', async () => {
    const result = await sut.execute({
      content: 'Aché',
      cnpj: '1234567890',
      description: 'lorem ipsum tarara',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryManufacturerRepository.items).toHaveLength(1)
      expect(inMemoryManufacturerRepository.items[0].content).toBe(result.value?.manufacturer.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'Aché',
      cnpj: '1234567890',
    })
    const result2 = await sut.execute({
      content: 'Aché',
      cnpj: '1234567890',
    })
    const result3 = await sut.execute({
      content: 'Astazeneca',
      cnpj: '1234567890',
    })
    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    expect(result3.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryManufacturerRepository.items).toHaveLength(1)
      expect(inMemoryManufacturerRepository.items[0].id).toBe(result.value?.manufacturer.id)
      expect(inMemoryManufacturerRepository.items[0].description).toBeUndefined()
    }
  })
})
