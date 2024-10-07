import { InMemoryStockRepository } from 'test/repositories/in-memory-stock-repository'
import { CreateStockUseCase } from './create-stock'
import { makeStock } from 'test/factories/make-stock'

let inMemoryStockRepository: InMemoryStockRepository
let sut: CreateStockUseCase

describe('Stock', () => {
  beforeEach(() => {
    inMemoryStockRepository = new InMemoryStockRepository()
    sut = new CreateStockUseCase(inMemoryStockRepository)
  })
  it('shoult be able create a stock', async () => {
    const stock = makeStock()
    const result = await sut.execute(stock)

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryStockRepository.items).toHaveLength(1)
      expect(inMemoryStockRepository.items[0].content).toBe(result.value?.stock.content)
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
      expect(inMemoryStockRepository.items).toHaveLength(1)
      expect(inMemoryStockRepository.items[0].id).toBe(result.value?.stock.id)
    }
  })
})
