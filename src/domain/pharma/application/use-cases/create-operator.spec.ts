import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { CreateOperatorUseCase } from './create-operator'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let sut: CreateOperatorUseCase

describe('Operator', () => {
  beforeEach(() => {
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository()
    sut = new CreateOperatorUseCase(inMemoryOperatorsRepository)
  })
  it('should be able create a operator', async () => {
    const operator = makeOperator()

    const result = await sut.execute(operator)

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].name).toBe(result.value?.operator.name)
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
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].id).toBe(result.value?.operator.id)
      expect(inMemoryOperatorsRepository.items[0].role).toBe('COMMON')
    }
  })
})
