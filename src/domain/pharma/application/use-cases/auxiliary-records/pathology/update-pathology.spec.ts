import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { UpdatePathologyUseCase } from './update-pathology'
import { makePathology } from 'test/factories/make-pathology'
import { PathologyAlreadyExistsError } from './_erros/pathology-already-exists-error'

let inMemoryPathologysRepository: InMemoryPathologiesRepository
let sut: UpdatePathologyUseCase

describe('Pathology', () => {
  beforeEach(() => {
    inMemoryPathologysRepository = new InMemoryPathologiesRepository()
    sut = new UpdatePathologyUseCase(inMemoryPathologysRepository)
  })
  it('shoult be able update a Pathology', async () => {
    const pathology = makePathology({
      content: 'pathology 1',
    })
    await inMemoryPathologysRepository.create(pathology)

    const result = await sut.execute({
      content: 'pathology 2',
      pathologyId: pathology.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPathologysRepository.items).toHaveLength(1)
      expect(inMemoryPathologysRepository.items[0].content).toBe('pathology 2')
    }
  })

  it('not should allowed duplicity', async () => {
    const pathology = makePathology({
      content: 'pathology 1',
    })
    const pathology2 = makePathology({
      content: 'pathology 2',
    })
    await inMemoryPathologysRepository.create(pathology)
    await inMemoryPathologysRepository.create(pathology2)

    const result = await sut.execute({
      pathologyId: pathology.id.toString(),
      content: pathology2.content,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PathologyAlreadyExistsError)
    }
  })
})
