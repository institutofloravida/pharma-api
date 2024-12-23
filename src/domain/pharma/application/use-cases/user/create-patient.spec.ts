import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { CreatePatientUseCase } from './create-patient'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makePathology } from 'test/factories/make-pathology'
import { faker } from '@faker-js/faker'

let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryPatientRepository: InMemoryPatientsRepository
let sut: CreatePatientUseCase

describe('Patient', () => {
  beforeEach(() => {
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
    inMemoryPatientRepository = new InMemoryPatientsRepository()
    sut = new CreatePatientUseCase(
      inMemoryPatientRepository,
      inMemoryPathologiesRepository,
    )
  })
  it('should be able create a patient', async () => {
    await inMemoryPathologiesRepository.create(
      makePathology({}, new UniqueEntityId('1')),
    )
    await inMemoryPathologiesRepository.create(
      makePathology({}, new UniqueEntityId('2')),
    )

    const addressFake = {
      city: 'Parnaíba',
      neighborhood: 'Centro',
      number: '2344',
      state: 'PI',
      zipCode: '64208120',
      street: 'Anhanguera',
      complement: '',
    }

    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.numeric({ length: 11 }),
      sus: faker.string.numeric({ length: 15 }),
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement([
        'black',
        'white',
        'yellow',
        'mixed',
        'undeclared',
        'indigenous',
      ]),
      addressPatient: addressFake,
      pathologiesIds: ['1', '2'],
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPatientRepository.items).toHaveLength(1)
      expect(inMemoryPatientRepository.items[0].getFormattedCpf()).toBe(
        result.value?.patient.getFormattedCpf(),
      )
    }
  })

  it('not should allowed duplicity at cpf', async () => {
    await inMemoryPathologiesRepository.create(
      makePathology({}, new UniqueEntityId('1')),
    )
    await inMemoryPathologiesRepository.create(
      makePathology({}, new UniqueEntityId('2')),
    )

    const addressFake = {
      city: 'Parnaíba',
      neighborhood: 'Centro',
      number: '2344',
      state: 'PI',
      zipCode: '64208120',
      street: 'Anhanguera',
      complement: '',
    }

    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: '12345678910',
      sus: faker.string.numeric({ length: 15 }),
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement([
        'black',
        'white',
        'yellow',
        'mixed',
        'undeclared',
        'indigenous',
      ]),
      addressPatient: addressFake,
      pathologiesIds: ['1', '2'],
    })

    const result2 = await sut.execute({
      name: faker.person.fullName(),
      cpf: '12345678910',
      sus: faker.string.numeric({ length: 15 }),
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement([
        'black',
        'white',
        'yellow',
        'mixed',
        'undeclared',
        'indigenous',
      ]),
      addressPatient: addressFake,
      pathologiesIds: ['1', '2'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPatientRepository.items).toHaveLength(1)
      expect(inMemoryPatientRepository.items[0].cpf).toBe(result.value?.patient.cpf)
    }
  })

  it('not should allowed duplicity at SUS card', async () => {
    await inMemoryPathologiesRepository.create(
      makePathology({}, new UniqueEntityId('1')),
    )
    await inMemoryPathologiesRepository.create(
      makePathology({}, new UniqueEntityId('2')),
    )

    const addressFake = {
      city: 'Parnaíba',
      neighborhood: 'Centro',
      number: '2344',
      state: 'PI',
      zipCode: '64208120',
      street: 'Anhanguera',
      complement: '',
    }

    const result = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.numeric({ length: 11 }),
      sus: '123456789012345',
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement([
        'black',
        'white',
        'yellow',
        'mixed',
        'undeclared',
        'indigenous',
      ]),
      addressPatient: addressFake,
      pathologiesIds: ['1', '2'],
    })

    const result2 = await sut.execute({
      name: faker.person.fullName(),
      cpf: faker.string.numeric({ length: 11 }),
      sus: '123456789012345',
      birthDate: faker.date.past(),
      gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      race: faker.helpers.arrayElement([
        'black',
        'white',
        'yellow',
        'mixed',
        'undeclared',
        'indigenous',
      ]),
      addressPatient: addressFake,
      pathologiesIds: ['1', '2'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPatientRepository.items).toHaveLength(1)
      expect(inMemoryPatientRepository.items[0].getFormattedCpf()).toBe(
        result.value?.patient.getFormattedCpf(),
      )
    }
  })
})
