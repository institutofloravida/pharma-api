import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { GetMedicineDetailsUseCase } from './get-medicine-details'
import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: GetMedicineDetailsUseCase
describe('Get Medicine', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )

    sut = new GetMedicineDetailsUseCase(inMemoryMedicinesRepository)
  })

  it('should be able to get a medicine', async () => {
    const therapeuticClass = makeTherapeuticClass()
    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const medicine = makeMedicine({
      therapeuticClassesIds: [therapeuticClass.id],
    })
    await inMemoryMedicinesRepository.create(medicine)

    const result = await sut.execute({
      id: medicine.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        content: medicine.content,
        therapeuticClasses: expect.arrayContaining([
          expect.objectContaining({
            id: therapeuticClass.id,
            name: therapeuticClass.content,
          }),
        ]),
      }),
    )
  })
})
