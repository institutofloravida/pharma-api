import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { CreateStockUseCase } from './create-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let sut: CreateStockUseCase

describe('Stock', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    inMemoryStocksRepository = new InMemoryStocksRepository()
    sut = new CreateStockUseCase(inMemoryStocksRepository, inMemoryInstitutionsRepository)
  })
  it('shoult be able create a stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)
    const result = await sut.execute({
      content: 'stock-01',
      institutionId: institution.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1)
      expect(inMemoryStocksRepository.items[0].content).toBe(result.value?.stock.content)
    }
  })

  it('not should allowed duplicity for same institution', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const institution2 = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution2)

    const result = await sut.execute({
      content: 'stock-01',
      institutionId: institution.id.toString(),
    })
    const result2 = await sut.execute({
      content: 'stock-01',
      institutionId: institution.id.toString(),
    })
    const result3 = await sut.execute({
      content: 'stock-01',
      institutionId: institution2.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    expect(result3.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(2)
      expect(inMemoryStocksRepository.items[0].id).toBe(result.value?.stock.id)
    }
  })

  it('not should be create a stock for a non-existent institution', async () => {
    const result = await sut.execute({
      content: 'stock-01',
      institutionId: 'institution-01',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(inMemoryStocksRepository.items).toHaveLength(0)
    }
  })
})
