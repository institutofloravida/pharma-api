import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { UpdateOperatorUseCase } from './update-operator'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeOperator } from 'test/factories/make-operator'
import { makeInstitution } from 'test/factories/make-insitution'
import { FakerHasher } from 'test/cryptography/fake-hasher'
import { OperatorWithSameEmailAlreadyExistsError } from './_errors/operator-with-same-email-already-exists-error'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let fakeHasher: FakerHasher
let sut: UpdateOperatorUseCase

describe('Update Operator', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )
    fakeHasher = new FakerHasher()
    sut = new UpdateOperatorUseCase(inMemoryOperatorsRepository, fakeHasher)
  })
  it('shoult be able update a Operator', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({
      name: 'Operator 1',
      email: 'operator@gmail.com',
      role: 'COMMON',
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const result = await sut.execute({
      operatorId: operator.id.toString(),
      name: 'Operator 2',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].name).toBe('Operator 2')
    }
  })

  it('not should allowed duplicity', async () => {
    const operator = makeOperator({
      email: 'operator@gmail.com',
    })
    const operator2 = makeOperator({
      email: 'operator2@gmail.com',
    })

    await inMemoryOperatorsRepository.create(operator)
    await inMemoryOperatorsRepository.create(operator2)

    const result = await sut.execute({
      operatorId: operator.id.toString(),
      email: 'operator2@gmail.com',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(
        OperatorWithSameEmailAlreadyExistsError,
      )
    }
  })
})
