import { makeInstitution } from 'test/factories/make-insitution'
import { UpdateInstitutionUseCase } from './update-institution'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InstitutionWithSameContentAlreadyExistsError } from './_errors/institution-with-same-content-already-exists-error'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let sut: UpdateInstitutionUseCase

describe('Update Institution', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    sut = new UpdateInstitutionUseCase(inMemoryInstitutionsRepository)
  })
  it('shoult be able update a Institution', async () => {
    const institution = makeInstitution({
      content: 'Institution 1',
      cnpj: '12345678902345',
      description: '',

    })
    await inMemoryInstitutionsRepository.create(institution)

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      content: 'Institution 2',
      cnpj: '12345678902344',
      description: 'some description',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryInstitutionsRepository.items).toHaveLength(1)
      expect(inMemoryInstitutionsRepository.items[0].content).toBe('Institution 2')
    }
  })

  it('not should allowed duplicity', async () => {
    const institution = makeInstitution({
      content: 'Institution 1',
      cnpj: '12345678912345',
    })
    const institution2 = makeInstitution({
      content: 'Institution 2',
      cnpj: '12345678912344',
    })
    await inMemoryInstitutionsRepository.create(institution)
    await inMemoryInstitutionsRepository.create(institution2)

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      content: 'Institution 2',
      cnpj: institution.cnpj,
      description: institution.description,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionWithSameContentAlreadyExistsError)
    }
  })
})
