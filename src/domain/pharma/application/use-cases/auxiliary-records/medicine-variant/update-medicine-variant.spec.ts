import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { UpdateMedicineVariantUseCase } from './update-medicine-variant'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeMedicine } from 'test/factories/make-medicine'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { MedicineVariantAlreadyExistsError } from './_errors/medicine-variant-already-exists-error'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryTherapeuticClassesRepository =
  new InMemoryTherapeuticClassesRepository()
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let sut: UpdateMedicineVariantUseCase

describe('MedicineVariant', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      )
    sut = new UpdateMedicineVariantUseCase(inMemoryMedicinesVariantsRepository)
  })
  it('shoult be able update a medicinevariant variant', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const pharmaceuticalForm2 = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm2)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const unitMeasure2 = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure2)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
      dosage: '10',
      complement: 'CX',
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)
    const result = await sut.execute({
      dosage: '50',
      pharmaceuticalFormId: pharmaceuticalForm2.id.toString(),
      unitMeasureId: unitMeasure2.id.toString(),
      medicineVariantId: medicineVariant.id.toString(),
      complement: 'CP',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicinesVariantsRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesVariantsRepository.items[0].dosage).toEqual('50')
      expect(
        inMemoryMedicinesVariantsRepository.items[0].pharmaceuticalFormId,
      ).toEqual(pharmaceuticalForm2.id)
      expect(
        inMemoryMedicinesVariantsRepository.items[0].unitMeasureId,
      ).toEqual(unitMeasure2.id)
      expect(
        inMemoryMedicinesVariantsRepository.items[0].complement,
      ).toEqual('CP')
    }
  })

  it('not should allowed duplicity', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const pharmaceuticalForm2 = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm2)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    const unitMeasure2 = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure2)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
      dosage: '10',
    })
    const medicineVariant2 = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm2.id,
      unitMeasureId: unitMeasure2.id,
      dosage: '10',
    })

    await Promise.all([
      inMemoryMedicinesVariantsRepository.create(medicineVariant),
      inMemoryMedicinesVariantsRepository.create(medicineVariant2),
    ])

    const result = await sut.execute({
      medicineVariantId: medicineVariant.id.toString(),
      pharmaceuticalFormId: pharmaceuticalForm2.id.toString(),
      unitMeasureId: unitMeasure2.id.toString(),
      dosage: '10',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(MedicineVariantAlreadyExistsError)
    }
  })
})
