import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { GetInstitutionUseCase } from './get-institution'

let inMemoryInstitutionsRepository:InMemoryInstitutionsRepository
let sut: GetInstitutionUseCase
describe('Get Institution', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    sut = new GetInstitutionUseCase(inMemoryInstitutionsRepository)
  })

  it('should be able to get a institution', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const result = await sut.execute({
      id: institution.id.toString(),
    })

    expect(result.value).toEqual(expect.objectContaining({
      content: institution.content,
      cnpj: institution.cnpj,
    }))
  })
})
