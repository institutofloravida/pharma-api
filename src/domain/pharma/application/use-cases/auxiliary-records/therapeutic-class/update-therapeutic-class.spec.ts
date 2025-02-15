import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'
import { UpdateTherapeuticClassUseCase } from './update-therapeutic-class'
import { TherapeuticClassAlreadyExistsError } from './_errors/therapeutic-class-already-exists-error'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'

let inMemoryTherapeuticClasssRepository: InMemoryTherapeuticClassesRepository
let sut: UpdateTherapeuticClassUseCase

describe('Update Therapeutic Class', () => {
  beforeEach(() => {
    inMemoryTherapeuticClasssRepository =
      new InMemoryTherapeuticClassesRepository()
    sut = new UpdateTherapeuticClassUseCase(
      inMemoryTherapeuticClasssRepository,
    )
  })
  it('shoult be able update a Therapeutic Class', async () => {
    const therapeuticClass = makeTherapeuticClass({
      content: 'therapeutic class 1',
    })
    await inMemoryTherapeuticClasssRepository.create(therapeuticClass)

    const result = await sut.execute({
      content: 'therapeutic class 2',
      therapeuticClassId: therapeuticClass.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryTherapeuticClasssRepository.items).toHaveLength(1)
      expect(inMemoryTherapeuticClasssRepository.items[0].content).toBe(
        'therapeutic class 2',
      )
    }
  })

  it('not should allowed duplicity', async () => {
    const therapeuticClass = makeTherapeuticClass({
      content: 'therapeutic class 1',
    })
    const therapeuticClass2 = makeTherapeuticClass({
      content: 'therapeutic class 2',
    })
    await inMemoryTherapeuticClasssRepository.create(therapeuticClass)
    await inMemoryTherapeuticClasssRepository.create(therapeuticClass2)

    const result = await sut.execute({
      therapeuticClassId: therapeuticClass.id.toString(),
      content: therapeuticClass2.content,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(TherapeuticClassAlreadyExistsError)
    }
  })
})
