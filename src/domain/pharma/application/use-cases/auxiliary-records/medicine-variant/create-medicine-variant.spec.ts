import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { CreateMedicineVariantUseCase } from './create-medicine-variant'
import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let sut: CreateMedicineVariantUseCase

describe('Medicine Variant', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)

    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )

    sut = new CreateMedicineVariantUseCase(inMemoryMedicinesVariantsRepository)
  })
  it('shoult be able create a Medicine Variant', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const result = await sut.execute({
      dosage: '30',
      medicineId: medicine.id.toString(),
      pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
      unitMeasureId: unitMeasure.id.toString(),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesVariantsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesVariantsRepository.items[0].dosage).toBe(result.value?.medicineVariant.dosage)
    }
  })

  it('not should allowed duplicity', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const result = await sut.execute({
      dosage: '30',
      medicineId: medicine.id.toString(),
      pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
      unitMeasureId: unitMeasure.id.toString(),
    })
    const result2 = await sut.execute({
      dosage: '30',
      medicineId: medicine.id.toString(),
      pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
      unitMeasureId: unitMeasure.id.toString(),
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesVariantsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesVariantsRepository.items[0].id).toBe(result.value?.medicineVariant.id)
    }
  })
})
