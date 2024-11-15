import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { FetchMedicinesVariantsUseCase } from './fetch-medicines-variants'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeMedicine } from 'test/factories/make-medicine'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'

let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let sut: FetchMedicinesVariantsUseCase
describe('Fetch medicines variants', () => {
  beforeEach(() => {
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository()
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )

    sut = new FetchMedicinesVariantsUseCase(inMemoryMedicinesVariantsRepository)
  })

  it('should be able to fetch medicines variants', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    await inMemoryMedicinesVariantsRepository.create(
      makeMedicineVariant({
        medicineId: medicine.id,
        createdAt: new Date(2024, 0, 29),
      }),
    )
    await inMemoryMedicinesVariantsRepository.create(
      makeMedicineVariant({
        pharmaceuticalFormId: pharmaceuticalForm.id,
        medicineId: medicine.id,
        unitMeasureId: unitMeasure.id,
        createdAt: new Date(2024, 0, 20),
      }),
    )
    await inMemoryMedicinesVariantsRepository.create(
      makeMedicineVariant({
        pharmaceuticalFormId: pharmaceuticalForm.id,
        medicineId: medicine.id,
        unitMeasureId: unitMeasure.id,
        createdAt: new Date(2024, 0, 27),
      }),
    )

    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      page: 1,
    })
    console.log(result.value?.medicinesVariants)
    expect(result.value?.medicinesVariants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      ]),
    )
  })

  it('should be able to fetch paginated medicinesvariants', async () => {
    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const pharmaceuticalForm = makePharmaceuticalForm()
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

    const unitMeasure = makeUnitMeasure()
    await inMemoryUnitsMeasureRepository.create(unitMeasure)

    for (let i = 1; i <= 22; i++) {
      await inMemoryMedicinesVariantsRepository.create(makeMedicineVariant({
        pharmaceuticalFormId: pharmaceuticalForm.id,
        medicineId: medicine.id,
        unitMeasureId: unitMeasure.id,
      }))
    }

    const result = await sut.execute({
      medicineId: medicine.id.toString(),
      page: 2,
    })

    expect(result.value?.medicinesVariants).toHaveLength(2)
  })
})
