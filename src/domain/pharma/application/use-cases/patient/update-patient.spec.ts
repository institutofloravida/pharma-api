import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { makePathology } from 'test/factories/make-pathology'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { makePatient } from 'test/factories/make-patient'
import { makeAddress } from 'test/factories/make-address'
import { subYears } from 'date-fns'
import { UpdatePatientUseCase } from './update-patient'
import { PatientAlreadyExistsError } from './_erros/patient-already-exists-error'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryPatientRepository: InMemoryPatientsRepository
let sut: UpdatePatientUseCase

describe('Update Patient', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
    inMemoryPatientRepository = new InMemoryPatientsRepository()
    sut = new UpdatePatientUseCase(
      inMemoryPatientRepository,
      inMemoryPathologiesRepository,
      inMemoryAddressRepository,
    )
  })
  it('should be able update a patient', async () => {
    const pathology1 = makePathology()
    const pathology2 = makePathology()
    const pathology3 = makePathology()
    await Promise.all([
      inMemoryPathologiesRepository.create(pathology1),
      inMemoryPathologiesRepository.create(pathology2),
      inMemoryPathologiesRepository.create(pathology3),
    ])

    const address = makeAddress({
      city: 'Parnaíba',
      neighborhood: 'Centro',
      number: '2344',
      state: 'PI',
      zipCode: '64208120',
      street: 'Anhanguera',
      complement: '',
    })

    await inMemoryAddressRepository.create(address)

    const patient = makePatient({
      name: 'Francisco Sousa',
      cpf: '09876543210',
      sus: '678905432178654',
      birthDate: subYears(new Date(), 25),
      gender: 'M',
      race: 'MIXED',
      addressId: address.id,
      pathologiesIds: [pathology1.id, pathology2.id],
    })
    await inMemoryPatientRepository.create(patient)

    const result = await sut.execute({
      patientId: patient.id.toString(),
      name: 'Francisco de Sousa',
      cpf: '09876543210',
      sus: patient.sus,
      birthDate: patient.birthDate,
      gender: 'M',
      race: 'MIXED',
      pathologiesIds: [pathology1.id.toString(), pathology3.id.toString()],
      addressPatient: {
        city: 'Parnaíba',
        neighborhood: 'Piauí',
        number: '2344',
        state: 'PI',
        zipCode: '64208120',
        street: 'Anhanguera',
        complement: 'Perto de algum lugar',
      },
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPatientRepository.items).toHaveLength(1)
      expect(inMemoryPatientRepository.items[0]).toEqual(
        expect.objectContaining({
          name: 'Francisco de Sousa',
        }),
      )
      expect(inMemoryAddressRepository.items[0]).toEqual(
        expect.objectContaining({
          neighborhood: 'Piauí',
          complement: 'Perto de algum lugar',
        }),
      )
    }
  })

  it('not should allowed duplicity at cpf', async () => {
    const pathology1 = makePathology()
    const pathology2 = makePathology()
    const pathology3 = makePathology()
    await Promise.all([
      inMemoryPathologiesRepository.create(pathology1),
      inMemoryPathologiesRepository.create(pathology2),
      inMemoryPathologiesRepository.create(pathology3),
    ])

    const address = makeAddress({
      city: 'Parnaíba',
      neighborhood: 'Centro',
      number: '2344',
      state: 'PI',
      zipCode: '64208120',
      street: 'Anhanguera',
      complement: '',
    })

    await inMemoryAddressRepository.create(address)

    const patient = makePatient({
      name: 'Francisco Sousa',
      cpf: '09876543210',
      sus: '678905432178654',
      birthDate: subYears(new Date(), 25),
      gender: 'M',
      race: 'MIXED',
      addressId: address.id,
      pathologiesIds: [pathology1.id, pathology2.id],
    })
    await inMemoryPatientRepository.create(patient)

    const patient2 = makePatient({
      name: 'Francisco Sousa',
      cpf: '09876543215',
      sus: '678905432178654',
      birthDate: subYears(new Date(), 25),
      gender: 'M',
      race: 'MIXED',
      addressId: address.id,
      pathologiesIds: [pathology1.id, pathology2.id],
    })
    await inMemoryPatientRepository.create(patient2)

    const result = await sut.execute({
      patientId: patient.id.toString(),
      name: 'Francisco de Sousa',
      cpf: '09876543215',
      sus: patient.sus,
      birthDate: patient.birthDate,
      gender: 'M',
      race: 'MIXED',
      pathologiesIds: [pathology1.id.toString(), pathology3.id.toString()],
      addressPatient: {
        city: 'Parnaíba',
        neighborhood: 'Piauí',
        number: '2344',
        state: 'PI',
        zipCode: '64208120',
        street: 'Anhanguera',
        complement: 'Perto de algum lugar',
      },
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PatientAlreadyExistsError)
    }
  })

  it('not should allowed duplicity at SUS card', async () => {
    const pathology1 = makePathology()
    const pathology2 = makePathology()
    const pathology3 = makePathology()
    await Promise.all([
      inMemoryPathologiesRepository.create(pathology1),
      inMemoryPathologiesRepository.create(pathology2),
      inMemoryPathologiesRepository.create(pathology3),
    ])

    const address = makeAddress({
      city: 'Parnaíba',
      neighborhood: 'Centro',
      number: '2344',
      state: 'PI',
      zipCode: '64208120',
      street: 'Anhanguera',
      complement: '',
    })

    await inMemoryAddressRepository.create(address)

    const patient = makePatient({
      name: 'Francisco Sousa',
      cpf: '09876543210',
      sus: '678905432178654',
      birthDate: subYears(new Date(), 25),
      gender: 'M',
      race: 'MIXED',
      addressId: address.id,
      pathologiesIds: [pathology1.id, pathology2.id],
    })
    await inMemoryPatientRepository.create(patient)

    const patient2 = makePatient({
      name: 'Francisco Sousa',
      cpf: '09876543215',
      sus: '098765432109876',
      birthDate: subYears(new Date(), 25),
      gender: 'M',
      race: 'MIXED',
      addressId: address.id,
      pathologiesIds: [pathology1.id, pathology2.id],
    })
    await inMemoryPatientRepository.create(patient2)

    const result = await sut.execute({
      patientId: patient.id.toString(),
      name: 'Francisco de Sousa',
      cpf: '09876543217',
      sus: '098765432109876',
      birthDate: patient.birthDate,
      gender: 'M',
      race: 'MIXED',
      pathologiesIds: [pathology1.id.toString(), pathology3.id.toString()],
      addressPatient: {
        city: 'Parnaíba',
        neighborhood: 'Piauí',
        number: '2344',
        state: 'PI',
        zipCode: '64208120',
        street: 'Anhanguera',
        complement: 'Perto de algum lugar',
      },
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PatientAlreadyExistsError)
    }
  })
})
