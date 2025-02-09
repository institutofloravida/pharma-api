import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { FetchPharmaceuticalFormsUseCase } from './fetch-pharmaceutical-form'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'

let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let sut: FetchPharmaceuticalFormsUseCase
describe('Fetch Pharmaceutical Forms', () => {
  beforeEach(() => {
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()

    sut = new FetchPharmaceuticalFormsUseCase(inMemoryPharmaceuticalFormsRepository)
  })

  it('should be able to fetch pharmaceutical forms', async () => {
    await inMemoryPharmaceuticalFormsRepository.create(
      makePharmaceuticalForm({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryPharmaceuticalFormsRepository.create(
      makePharmaceuticalForm({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryPharmaceuticalFormsRepository.create(
      makePharmaceuticalForm({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.pharmaceuticalForms).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated pharmaceutical forms', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryPharmaceuticalFormsRepository.create(makePharmaceuticalForm())
    }

    const result = await sut.execute({
      page: 3,
    })

    expect(result.value?.pharmaceuticalForms).toHaveLength(2)
  })
})
