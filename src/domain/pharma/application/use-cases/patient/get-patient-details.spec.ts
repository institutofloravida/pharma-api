import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { makePathology } from 'test/factories/make-pathology'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { makePatient } from 'test/factories/make-patient'
import { makeAddress } from 'test/factories/make-address'
import { GetPatientDetailsUseCase } from './get-patient-details'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryPatientRepository: InMemoryPatientsRepository
let sut: GetPatientDetailsUseCase

describe('Get Patient Details', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
    inMemoryPatientRepository = new InMemoryPatientsRepository(
      inMemoryAddressRepository, inMemoryPathologiesRepository,
    )

    sut = new GetPatientDetailsUseCase(
      inMemoryPatientRepository,
    )
  })
  it('should be able get details patient', async () => {
    const pathology1 = makePathology()
    await Promise.all([
      inMemoryPathologiesRepository.create(pathology1),
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
      gender: 'M',
      race: 'MIXED',
      addressId: address.id,
      pathologiesIds: [pathology1.id],
    })
    await inMemoryPatientRepository.create(patient)

    const result = await sut.execute({
      id: patient.id.toString(),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value).toEqual(
        expect.objectContaining({
          name: 'Francisco Sousa',
          cpf: '09876543210',
          sus: '678905432178654',
          gender: 'M',
          race: 'MIXED',
          address: expect.objectContaining({
            city: 'Parnaíba',
            neighborhood: 'Centro',
            number: '2344',
            state: 'PI',
            zipCode: '64208120',
            street: 'Anhanguera',
            complement: '',
          }),
        }),
      )
    }
  })
})
