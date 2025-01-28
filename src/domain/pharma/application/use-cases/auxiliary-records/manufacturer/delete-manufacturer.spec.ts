import { DeleteManufacturerUseCase } from './delete-manufacturer'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { ManufacturerHasDependencyError } from './_errors/manufacturer-has-dependency-error'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { makeBatch } from 'test/factories/make-batch'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'

let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let sut: DeleteManufacturerUseCase

describe('Manufacturer', () => {
  beforeEach(() => {
    inMemoryBatchesRepository = new InMemoryBatchesRepository()

    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
    sut = new DeleteManufacturerUseCase(inMemoryManufacturersRepository, inMemoryBatchesRepository)
  })
  it('shoult be able delete a Manufacturer', async () => {
    const Manufacturer = makeManufacturer({
      content: 'Manufacturer 1',
    })
    await inMemoryManufacturersRepository.create(Manufacturer)

    const result = await sut.execute({
      manufacturerId: Manufacturer.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryManufacturersRepository.items).toHaveLength(0)
    }
  })

  it('shoult not be able delete a Manufacturer with dependent batch', async () => {
    const Manufacturer = makeManufacturer({
      content: 'Manufacturer 1',
    })
    await inMemoryManufacturersRepository.create(Manufacturer)

    const batch = makeBatch({
      manufacturerId: Manufacturer.id,
    })
    await inMemoryBatchesRepository.create(batch)

    const result = await sut.execute({
      manufacturerId: Manufacturer.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ManufacturerHasDependencyError)
  })
})
