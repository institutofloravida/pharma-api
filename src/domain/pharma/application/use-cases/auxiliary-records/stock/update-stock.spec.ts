import { UpdateStockUseCase } from './update-stock'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { StockAlreadyExistsError } from './_errors/stock-already-exists-error'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'

let inMemoryInstituionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let sut: UpdateStockUseCase

describe('Stock', () => {
  beforeEach(() => {
    inMemoryInstituionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstituionsRepository)
    sut = new UpdateStockUseCase(inMemoryStocksRepository)
  })
  it('shoult be able update a Stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstituionsRepository.create(institution)

    const stock = makeStock({
      content: 'stock 1',
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const result = await sut.execute({
      content: 'stock 2',
      stockId: stock.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1)
      expect(inMemoryStocksRepository.items[0].content).toBe('stock 2')
    }
  })

  it('shoult be able to inative a stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstituionsRepository.create(institution)

    const stock = makeStock({
      content: 'stock 1',
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const result = await sut.execute({
      stockId: stock.id.toString(),
      status: false,
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1)
      expect(inMemoryStocksRepository.items[0].status).toBeFalsy()
    }
  })

  it('not should allowed duplicity of same institution', async () => {
    const institution = makeInstitution()
    await inMemoryInstituionsRepository.create(institution)

    const stock = makeStock({
      content: 'stock 1',
      institutionId: institution.id,
    })
    const stock2 = makeStock({
      content: 'stock 2',
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)
    await inMemoryStocksRepository.create(stock2)

    const result = await sut.execute({
      stockId: stock.id.toString(),
      content: stock2.content,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(StockAlreadyExistsError)
    }
  })
})
