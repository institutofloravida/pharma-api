import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { FakerHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateOperatorUseCase } from './authenticate-operator'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let fakeHasher: FakerHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateOperatorUseCase

describe('Authenticate Operator', () => {
  beforeEach(() => {
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository()
    fakeHasher = new FakerHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateOperatorUseCase(inMemoryOperatorsRepository, fakeHasher, fakeEncrypter)
  })
  it('shoult be able to authenticate a operator', async () => {
    const operator = makeOperator({
      email: 'teste@gmail.com',
      passwordHash: await fakeHasher.hash('1234567'),
    })
    inMemoryOperatorsRepository.create(operator)
    const result = await sut.execute({
      email: operator.email,
      password: '1234567',
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
