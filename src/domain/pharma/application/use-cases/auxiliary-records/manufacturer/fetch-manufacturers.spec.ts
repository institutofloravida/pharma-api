import { InMemoryManufacturersRepository } from "test/repositories/in-memory-manufacturers-repository"
import { FetchManufacturersUseCase } from "../manufacturer/fetch-manufacturers"
import { makeManufacturer } from "test/factories/make-manaufacturer"

let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let sut: FetchManufacturersUseCase
describe('Fetch manufatureres', () => {
  beforeEach(() => {
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()

    sut = new FetchManufacturersUseCase(inMemoryManufacturersRepository)
  })

  it('should be able to fetch manufatureres', async () => {
    await inMemoryManufacturersRepository.create(
      makeManufacturer({createdAt: new Date(2024,0,29)}),
    )
    await inMemoryManufacturersRepository.create(
      makeManufacturer({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryManufacturersRepository.create(
      makeManufacturer({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.manufacturers).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated pharmaceutical forms', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryManufacturersRepository.create(makeManufacturer())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.manufacturers).toHaveLength(2)
  })
})

