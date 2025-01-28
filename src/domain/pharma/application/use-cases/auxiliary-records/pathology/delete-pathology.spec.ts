import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { DeletePathologyUseCase } from './delete-pathology'
import { makePathology } from 'test/factories/make-pathology'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { makePatient } from 'test/factories/make-patient'
import { PathologyHasDependencyError } from './_erros/pathology-has-dependency-error'

let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryPathologysRepository: InMemoryPathologiesRepository
let sut: DeletePathologyUseCase

describe('Pathology', () => {
  beforeEach(() => {
    inMemoryPatientsRepository = new InMemoryPatientsRepository()

    inMemoryPathologysRepository = new InMemoryPathologiesRepository()
    sut = new DeletePathologyUseCase(inMemoryPathologysRepository, inMemoryPatientsRepository)
  })
  it('shoult be able delete a Pathology', async () => {
    const pathology = makePathology({
      content: 'pathology 1',
    })
    await inMemoryPathologysRepository.create(pathology)

    const result = await sut.execute({
      pathologyId: pathology.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPathologysRepository.items).toHaveLength(0)
    }
  })

  it('shoult not be able delete a pathology with dependent patient', async () => {
    const pathology = makePathology({
      content: 'pathology 1',
    })
    await inMemoryPathologysRepository.create(pathology)

    const patient = makePatient({
      pathologiesIds: [pathology.id],
    })
    await inMemoryPatientsRepository.create(patient)

    const result = await sut.execute({
      pathologyId: pathology.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(PathologyHasDependencyError)
  })
})
