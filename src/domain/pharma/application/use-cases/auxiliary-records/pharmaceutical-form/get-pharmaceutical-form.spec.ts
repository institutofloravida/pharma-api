import { GetPharmaceuticalFormUseCase } from './get-pharmaceutical-form'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'

let inMemoryPharmaceuticalRepository: InMemoryPharmaceuticalFormsRepository
let sut: GetPharmaceuticalFormUseCase
describe('Get Pharmaceutical Form', () => {
  beforeEach(() => {
    inMemoryPharmaceuticalRepository =
      new InMemoryPharmaceuticalFormsRepository()

    sut = new GetPharmaceuticalFormUseCase(inMemoryPharmaceuticalRepository)
  })

  it('should be able to get a pharmaceutical form', async () => {
    const pharmaceuticalform = makePharmaceuticalForm()
    await inMemoryPharmaceuticalRepository.create(pharmaceuticalform)

    const result = await sut.execute({
      id: pharmaceuticalform.id.toString(),
    })

    expect(result.value).toEqual(
      expect.objectContaining({
        content: pharmaceuticalform.content,
      }),
    )
  })
})
