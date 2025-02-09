import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { FetchStocksUseCase } from './fetch-stocks'
import { makeStock } from 'test/factories/make-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryInstitutionRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository:InMemoryStocksRepository
let sut: FetchStocksUseCase
describe('Fetch Stocks', () => {
  beforeEach(() => {
    inMemoryInstitutionRepository = new InMemoryInstitutionsRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(inMemoryInstitutionRepository)
    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionRepository)

    sut = new FetchStocksUseCase(inMemoryStocksRepository, inMemoryOperatorsRepository, inMemoryInstitutionRepository)
  })

  it('should be able to fetch stocks', async () => {
    const operator = makeOperator({
      role: 'MANAGER',
    })

    const institution = makeInstitution()
    const institution2 = makeInstitution()

    operator.institutionsIds = [institution.id]

    await inMemoryOperatorsRepository.create(operator)
    await inMemoryInstitutionRepository.create(institution)
    await inMemoryInstitutionRepository.create(institution2)
    await inMemoryStocksRepository.create(
      makeStock({
        institutionId: institution.id,
        createdAt: new Date(2024, 0, 29),
      }),
    )
    await inMemoryStocksRepository.create(
      makeStock({
        institutionId: institution.id,
        createdAt: new Date(2024, 0, 20),
      }),
    )
    await inMemoryStocksRepository.create(
      makeStock({
        institutionId: institution2.id,
        createdAt: new Date(2024, 0, 27),
      }),
    )
    const result = await sut.execute({
      page: 1,
      institutionsIds: [institution.id.toString()],
      operatorId: operator.id.toString(),
    })
    const result2 = await sut.execute({
      page: 1,
      operatorId: operator.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isRight()).toBeTruthy()

    if (result.isRight() && result2.isRight()) {
      expect(result.value.stocks).toHaveLength(2)
    }
  })

  it('should be able to fetch paginated stocks', async () => {
    const operator = makeOperator({
      role: 'MANAGER',
    })
    const institution = makeInstitution()
    const institution2 = makeInstitution()

    operator.institutionsIds = [institution.id]

    await inMemoryOperatorsRepository.create(operator)
    await inMemoryInstitutionRepository.create(institution)
    await inMemoryInstitutionRepository.create(institution2)

    for (let i = 1; i <= 22; i++) {
      Promise.all([
        inMemoryStocksRepository.create(makeStock({
          institutionId: institution.id,
        })),
        inMemoryStocksRepository.create(makeStock({
          institutionId: institution.id,
        })),
        inMemoryStocksRepository.create(makeStock({
          institutionId: institution2.id,
        })),
      ])
    }
    const result = await sut.execute({
      page: 5,
      institutionsIds: [institution.id.toString()],
      operatorId: operator.id.toString(),
    })

    const result2 = await sut.execute({
      page: 3,
      institutionsIds: [institution.id.toString(), institution2.id.toString()],
      operatorId: operator.id.toString(),

    })
    if (result.isRight()) {
      expect(result.value?.stocks).toHaveLength(4)
    }

    expect(result2.isLeft()).toBeTruthy()
  })
})
