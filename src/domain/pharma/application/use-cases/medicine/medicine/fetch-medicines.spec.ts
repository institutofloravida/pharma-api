import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { FetchMedicinesUseCase } from '../medicine/fetch-medicines'
import { makeMedicine } from 'test/factories/make-medicine'

let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: FetchMedicinesUseCase
describe('Fetch medicines', () => {
  beforeEach(() => {
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()

    sut = new FetchMedicinesUseCase(inMemoryMedicinesRepository)
  })

  it('should be able to fetch medicines', async () => {
    await inMemoryMedicinesRepository.create(
      makeMedicine({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryMedicinesRepository.create(
      makeMedicine({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryMedicinesRepository.create(
      makeMedicine({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.medicines).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated medicines', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryMedicinesRepository.create(makeMedicine())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.medicines).toHaveLength(2)
  })
})
