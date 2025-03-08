import { RegisterOperatorUseCase } from './register-operator'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { FakerHasher } from 'test/cryptography/fake-hasher'
import { faker } from '@faker-js/faker'
import { NoAssociatedInstitutionError } from './_errors/no-associated-institution-error'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'
import { makeOperator } from 'test/factories/make-operator'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let fakeHasher: FakerHasher
let sut: RegisterOperatorUseCase

describe('Register Operator', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )
    fakeHasher = new FakerHasher()
    sut = new RegisterOperatorUseCase(
      inMemoryInstitutionsRepository,
      inMemoryOperatorsRepository,
      fakeHasher,
    )
  })
  it('shoult be able to register a new Operator', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const result = await sut.execute({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: OperatorRole.SUPER_ADMIN,
      institutionsIds: [institution.id.toString()],
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].email).toBe(
        result.value?.operator.email,
      )
    }
  })

  it('shoult hash operator password upon registration', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const result = await sut.execute({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: '123456',
      role: OperatorRole.SUPER_ADMIN,
      institutionsIds: [institution.id.toString()],
    })

    const hashedPassword = await fakeHasher.hash('123456')
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOperatorsRepository.items[0].passwordHash).toBe(
      hashedPassword,
    )
  })

  it('shoult not be able to register two operators with same email', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const result = await sut.execute({
      name: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: OperatorRole.SUPER_ADMIN,
      institutionsIds: [institution.id.toString()],
    })

    const result2 = await sut.execute({
      name: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: OperatorRole.SUPER_ADMIN,
      institutionsIds: [],
    })
    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1)
      expect(inMemoryOperatorsRepository.items[0].email).toBe(
        result.value?.operator.email,
      )
    }
  })

  it('should not be possible to register an operator(COMMOM or MANAGER) without any associated institution', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)
    const operator = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const result = await sut.execute({
      name: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: OperatorRole.MANAGER,
      institutionsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NoAssociatedInstitutionError)
  })
})
