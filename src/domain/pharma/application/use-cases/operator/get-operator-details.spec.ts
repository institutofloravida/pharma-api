import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { makeOperator } from 'test/factories/make-operator'
import { GetOperatorDetailsUseCase } from './get-operator-details'

let inMemoryOperatorsRepository:InMemoryOperatorsRepository
let sut: GetOperatorDetailsUseCase
describe('Get Operator Details', () => {
  beforeEach(() => {
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository()

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
