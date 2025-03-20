import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { FetchMedicinesUseCase } from '../medicine/fetch-medicines'
import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: FetchMedicinesUseCase
describe('Fetch medicines', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()

    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)

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
      page: 3,
    })

    expect(result.value?.medicines).toHaveLength(2)
  })

  it('should be able to fetch filtered medicines', async () => {
    const therapeuticClass = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const therapeuticClass2 = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass2)

    for (let i = 1; i <= 10; i++) {
      await inMemoryMedicinesRepository.create(
        makeMedicine({
          content: 'teste',
          therapeuticClassesIds: [therapeuticClass.id],
        }),
      )
      await inMemoryMedicinesRepository.create(
        makeMedicine({
          content: 'teste',
          therapeuticClassesIds: [therapeuticClass2.id],
        }),
      )
    }

    for (let i = 1; i <= 5; i++) {
      await inMemoryMedicinesRepository.create(
        makeMedicine({
          content: 'abcde',
        }),
      )
    }

    const result = await sut.execute({
      page: 1,
      content: 'ab',
    })

    const result2 = await sut.execute({
      page: 1,
      therapeuticClassesIds: [therapeuticClass.id.toString()],
    })

    const result3 = await sut.execute({
      page: 1,
      therapeuticClassesIds: [
        therapeuticClass.id.toString(),
        therapeuticClass2.id.toString(),
      ],
    })

    expect(result.isRight()).toBeTruthy()
    expect(result2.isRight()).toBeTruthy()
    expect(result3.isRight()).toBeTruthy()
    expect(result.value?.medicines).toHaveLength(5)
    expect(result2.value?.medicines).toHaveLength(10)
    expect(result3.value?.meta.totalCount).toEqual(20)
  })
})
