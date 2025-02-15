import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { GetTherapeuticClassUseCase } from './get-therapeutic-class'
import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'

let inMemoryTherapeuticClassesRepository:InMemoryTherapeuticClassesRepository
let sut: GetTherapeuticClassUseCase
describe('Get Therapeutic Class', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()

    sut = new GetTherapeuticClassUseCase(inMemoryTherapeuticClassesRepository)
  })

  it('should be able to get a therapeuticclass', async () => {
    const therapeuticClass = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const result = await sut.execute({
      id: therapeuticClass.id.toString(),
    })

    expect(result.value).toEqual(expect.objectContaining({
      content: therapeuticClass.content,
    }))
  })
})
