import { makeManufacturer } from 'test/factories/make-manufacturer'
import { GetManufacturerUseCase } from './get-manufacturer'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'

let inMemoryManufacturersRepository:InMemoryManufacturersRepository
let sut: GetManufacturerUseCase
describe('Get Manufacturer', () => {
  beforeEach(() => {
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()

    sut = new GetManufacturerUseCase(inMemoryManufacturersRepository)
  })

  it('should be able to get a manufacturer', async () => {
    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const result = await sut.execute({
      id: manufacturer.id.toString(),
    })

    expect(result.value).toEqual(expect.objectContaining({
      content: manufacturer.content,
      cnpj: manufacturer.cnpj,
      description: manufacturer.description,
    }))
  })
})
