import { UpdateMedicineUseCase } from './update-medicine'
import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'
import { MedicineAlreadyExistsError } from './_errors/medicine-already-exists-error'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: UpdateMedicineUseCase

describe('Medicine', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
    sut = new UpdateMedicineUseCase(inMemoryMedicinesRepository)
  })
  it('shoult be able update a Medicine', async () => {
    const therapeuticClass = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const therapeuticClass2 = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass2)

    const medicine = makeMedicine({
      content: 'medicine 1',
      therapeuticClassesIds: [therapeuticClass.id],
    })
    await inMemoryMedicinesRepository.create(medicine)

    const result = await sut.execute({
      content: 'medicine 2',
      medicineId: medicine.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesRepository.items[0].content).toBe('medicine 2')
    }
  })

  it('not should allowed duplicity', async () => {
    const therapeuticClass = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const medicine = makeMedicine({
      content: 'medicine 1',
      therapeuticClassesIds: [therapeuticClass.id],
    })
    const medicine2 = makeMedicine({
      content: 'medicine 2',
      therapeuticClassesIds: [therapeuticClass.id],
    })

    await Promise.all([
      inMemoryMedicinesRepository.create(medicine),
      inMemoryMedicinesRepository.create(medicine2),
    ])

    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      content: medicine2.content,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(MedicineAlreadyExistsError)
    }
  })
})
