import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { DeleteTherapeuticClassUseCase } from './delete-therapeutic-class'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { makeTherapeuticClass } from 'test/factories/make-therapeutic-class'
import { makeMedicine } from 'test/factories/make-medicine'
import { TherapeuticClassHasDependencyError } from './_errors/therapeutic-class-has-dependency'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryPathologysRepository: InMemoryPathologiesRepository
let sut: DeleteTherapeuticClassUseCase

describe('Delete Therapeutic Class', () => {
  beforeEach(() => {

    inMemoryTherapeuticClassesRepository= new InMemoryTherapeuticClassesRepository()
    inMemoryMedicinesRepository= new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)

    sut = new DeleteTherapeuticClassUseCase(inMemoryTherapeuticClassesRepository, inMemoryMedicinesRepository)
  })
  it('shoult be able delete a Therapeutic Class', async () => {
    
    const therapeuticClass = makeTherapeuticClass({})

    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const result = await sut.execute({
        therapeuticClassId: therapeuticClass.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryTherapeuticClassesRepository.items).toHaveLength(0)
    }
  })

  it('shoult not be able delete a therapeutic class with dependent(medicine)', async () => {
    const therapeuticClass = makeTherapeuticClass({})

    await inMemoryTherapeuticClassesRepository.create(therapeuticClass)

    const medicine = makeMedicine({
        therapeuticClassesIds: [therapeuticClass.id]
    })
    await inMemoryMedicinesRepository.create(medicine)

    const result = await sut.execute({
        therapeuticClassId: therapeuticClass.id.toString()
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(TherapeuticClassHasDependencyError)
  })
})
