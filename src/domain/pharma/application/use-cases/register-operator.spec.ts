import { RegisterOperatorUseCase } from './register-operator'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { FakerHasher } from 'test/cryptography/fake-hasher'
import { faker } from '@faker-js/faker'

let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let fakeHasher: FakerHasher
let sut: RegisterOperatorUseCase

describe('Register Operator', () => {
  beforeEach(() => {
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository()
    fakeHasher = new FakerHasher()
    sut = new RegisterOperatorUseCase(inMemoryOperatorsRepository, fakeHasher)
  })
  it('shoult be able to register a new Operator', async () => {
    const result = await sut.execute({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'ADMIN',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].email).toBe(result.value?.operator.email)
    }
  })

  it('shoult hash operator password upon registration', async () => {
    const result = await sut.execute({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: '123456',
      role: 'ADMIN',
    })

    const hashedPassword = await fakeHasher.hash('123456')
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOperatorsRepository.items[0].passwordHash).toBe(hashedPassword)
  })

  it('shoult not be able to register two operators with same email', async () => {
    const result = await sut.execute({
      name: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: 'ADMIN',
    })

    const result2 = await sut.execute({
      name: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: 'ADMIN',
    })
    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].email).toBe(result.value?.operator.email)
    }
  })
})
