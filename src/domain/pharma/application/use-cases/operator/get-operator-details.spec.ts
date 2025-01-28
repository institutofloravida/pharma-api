import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { makeOperator } from 'test/factories/make-operator'
import { GetOperatorDetailsUseCase } from './get-operator-details'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryOperatorsRepository:InMemoryOperatorsRepository
let sut: GetOperatorDetailsUseCase
describe('Get Operator Details', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(inMemoryInstitutionsRepository)

    sut = new GetOperatorDetailsUseCase(inMemoryOperatorsRepository)
  })

  it('should be able to get operator details', async () => {
    const operator = makeOperator()
    await inMemoryOperatorsRepository.create(operator)

    const result = await sut.execute({ operatorId: operator.id.toString() })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.operator.id).toBe(operator.id)
    }
  })
})
