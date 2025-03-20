import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { CreateMedicineUseCase } from './create-medicine'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: CreateMedicineUseCase

describe('Medicine', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)
    sut = new CreateMedicineUseCase(inMemoryMedicinesRepository)
  })
  it('shoult be able create a Medicine', async () => {
    const result = await sut.execute({
      content: 'dipirona',
      therapeuticClassesIds: [],
      description: 'lorem ipsum tarara',
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesRepository.items[0].content).toBe(result.value?.medicine.content)
    }
  })

  it('not should allowed duplicity', async () => {
    const result = await sut.execute({
      content: 'dipirona',
      therapeuticClassesIds: [],
    })
    const result2 = await sut.execute({
      content: 'dipirona',
      therapeuticClassesIds: [],
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesRepository.items[0].id).toBe(result.value?.medicine.id)
      expect(inMemoryMedicinesRepository.items[0].description).toBeUndefined()
    }
  })
})
