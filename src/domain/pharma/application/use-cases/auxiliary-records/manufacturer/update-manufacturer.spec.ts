import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { UpdateManufacturerUseCase } from './update-manufacturer'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { ManufacturerWithSameContentAlreadyExistsError } from './_errors/manufacturer-with-same-content-already-exists-error'

let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let sut: UpdateManufacturerUseCase

describe('Update Manufacturer', () => {
  beforeEach(() => {
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
    sut = new UpdateManufacturerUseCase(inMemoryManufacturersRepository)
  })
  it('shoult be able update a Manufacturer', async () => {
    const manufacturer = makeManufacturer({
      content: 'Manufacturer 1',
      cnpj: '12345678902345',
      description: '',

    })
    await inMemoryManufacturersRepository.create(manufacturer)
    
    const result = await sut.execute({
      manufacturerId: manufacturer.id.toString(),
      content: 'Manufacturer 2',
      cnpj:  '12345678902344',
      description: 'some description'
    })


    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryManufacturersRepository.items).toHaveLength(1)
      expect(inMemoryManufacturersRepository.items[0].content).toBe('Manufacturer 2')
    }
  })

  it('not should allowed duplicity', async () => {
    const manufacturer = makeManufacturer({
      content: 'Manufacturer 1',
      cnpj: '12345678912345'
    })
    const manufacturer2 = makeManufacturer({
      content: 'Manufacturer 2',
      cnpj: '12345678912344'
    })
    await inMemoryManufacturersRepository.create(manufacturer)
    await inMemoryManufacturersRepository.create(manufacturer2)
    
    const result = await sut.execute({
      manufacturerId: manufacturer.id.toString(),
      content: 'Manufacturer 2',
      cnpj: manufacturer.cnpj,
      description: manufacturer.description,
    })
    console.log(result.value)
    
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ManufacturerWithSameContentAlreadyExistsError)
    }
  })

})
