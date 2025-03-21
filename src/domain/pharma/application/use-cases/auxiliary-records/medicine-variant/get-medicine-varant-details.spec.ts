import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { GetMedicineVariantDetailsUseCase } from './get-medicine-variant-details'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryTherapeuticClassesRepository =
  new InMemoryTherapeuticClassesRepository()
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let sut: GetMedicineVariantDetailsUseCase
describe('Get a medicine variant', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )

    sut = new GetMedicineVariantDetailsUseCase(
      inMemoryMedicinesVariantsRepository,
    )
  })

  it('should be able to get a medicine variant', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)
    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    })

    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const result = await sut.execute({
      id: medicineVariant.id.toString(),
    })
    console.log(result.value)
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        medicine: medicine.content,
        pharmaceuticalForm: pharmaceuticalForm.content,
        unitMeasure: unitMeasure.acronym,
      }),
    )
  })
})
