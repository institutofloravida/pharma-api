import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { CreateStockUseCase } from './create-stock'
import { makeStock } from 'test/factories/make-stock'

let inMemoryStocksRepository: InMemoryStocksRepository
let sut: CreateStockUseCase

describe('Stock', () => {
  beforeEach(() => {
    inMemoryStocksRepository = new InMemoryStocksRepository()
    sut = new CreateStockUseCase(inMemoryStocksRepository)
  })
  it('shoult be able create a stock', async () => {
    const stock = makeStock()
    const result = await sut.execute(stock)

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1)
      expect(inMemoryStocksRepository.items[0].content).toBe(result.value?.stock.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute(makeStock({
      content: 'floravida',
    }))
    const result2 = await sut.execute(makeStock({
      content: 'floravida',
    }))

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1)
      expect(inMemoryStocksRepository.items[0].id).toBe(result.value?.stock.id)
    }
  })
})
