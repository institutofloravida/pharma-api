import { UpdatePharmaceuticalFormUseCase } from './update-pharmaceutical-form'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { PharmaceuticalFormAlreadyExistsError } from './_errors/pharmaceutical-form-already-exists-error'

let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let sut: UpdatePharmaceuticalFormUseCase

describe('Update Pharmaceutical Form', () => {
  beforeEach(() => {
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    sut = new UpdatePharmaceuticalFormUseCase(
      inMemoryPharmaceuticalFormsRepository,
    )
  })
  it('shoult be able update a pharmaceutical form', async () => {
    const pharmaceuticalform = makePharmaceuticalForm({
      content: 'pharmaceutical form 1',
    })
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalform)

    const result = await sut.execute({
      content: 'pharmaceutical form 2',
      pharmaceuticalformId: pharmaceuticalform.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryPharmaceuticalFormsRepository.items).toHaveLength(1)
      expect(inMemoryPharmaceuticalFormsRepository.items[0].content).toBe(
        'pharmaceutical form 2',
      )
    }
  })

  it('not should allowed duplicity', async () => {
    const pharmaceuticalform = makePharmaceuticalForm({
      content: 'pharmaceutical form 1',
    })
    const pharmaceuticalform2 = makePharmaceuticalForm({
      content: 'pharmaceutical form 2',
    })
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalform)
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalform2)

    const result = await sut.execute({
      pharmaceuticalformId: pharmaceuticalform.id.toString(),
      content: pharmaceuticalform2.content,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PharmaceuticalFormAlreadyExistsError)
    }
  })
})
