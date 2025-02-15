import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { GetPathologyUseCase } from './get-pathology'
import { makePathology } from 'test/factories/make-pathology'

let inMemoryPathologiesRepository:InMemoryPathologiesRepository
let sut: GetPathologyUseCase
describe('Get Pathology', () => {
  beforeEach(() => {
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()

    sut = new GetPathologyUseCase(inMemoryPathologiesRepository)
  })

  it('should be able to get a pathology', async () => {
    const pathology = makePathology()
    await inMemoryPathologiesRepository.create(pathology)

    const result = await sut.execute({
      id: pathology.id.toString(),
    })

    expect(result.value).toEqual(expect.objectContaining({
      content: pathology.content,
    }))
  })
})
