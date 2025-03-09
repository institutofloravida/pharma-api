import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { GetStockDetailsUseCase } from './get-stock-details'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository:InMemoryStocksRepository
let sut: GetStockDetailsUseCase
describe('Get Stock', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)

    sut = new GetStockDetailsUseCase(inMemoryStocksRepository)
  })

  it('should be able to get a stock', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const stock = makeStock({ institutionId: institution.id })
    await inMemoryStocksRepository.create(stock)

    const result = await sut.execute({
      id: stock.id.toString(),
    })

    expect(result.value).toEqual(expect.objectContaining({
      content: stock.content,
      status: true,
    }))
  })
})
