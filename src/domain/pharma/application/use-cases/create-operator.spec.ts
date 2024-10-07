import { InMemoryOperatorRepository } from 'test/repositories/in-memory-operator-repository'
import { CreateOperatorUseCase } from './create-operator'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryOperatorRepository: InMemoryOperatorRepository
let sut: CreateOperatorUseCase

describe('Operator', () => {
  beforeEach(() => {
    inMemoryOperatorRepository = new InMemoryOperatorRepository()
    sut = new CreateOperatorUseCase(inMemoryOperatorRepository)
  })
  it('should be able create a operator', async () => {
    const operator = makeOperator()

    const result = await sut.execute(operator)

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorRepository.items).toHaveLength(1)
      expect(inMemoryOperatorRepository.items[0].name).toBe(result.value?.operator.name)
    }
  })

  it('not should allowed duplicity', async () => {
    const operator1 = makeOperator({
      email: 'teste@gmail.com',
    })
    const operator2 = makeOperator({
      email: 'teste@gmail.com',
    })

    const result = await sut.execute(operator1)
    const result2 = await sut.execute(operator2)

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorRepository.items).toHaveLength(1)
      expect(inMemoryOperatorRepository.items[0].id).toBe(result.value?.operator.id)
      expect(inMemoryOperatorRepository.items[0].role).toBe('COMMON')
    }
  })
})
