import { GetMedicineUseCase } from './get-medicine'
import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'

let inMemoryMedicinesRepository:InMemoryMedicinesRepository
let sut: GetMedicineUseCase
describe('Get Medicine', () => {
  beforeEach(() => {
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()

    sut = new GetMedicineUseCase(inMemoryMedicinesRepository)
  })

  it('should be able to get a medicine', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const result = await sut.execute({
      id: medicine.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(expect.objectContaining({
      content: medicine.content,
    }))
  })
})
