import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { makeBatch } from 'test/factories/make-batch'
import { DeleteMedicineUseCase } from './delete-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { MedicineHasDependencyError } from './_errors/medicine-has-dependency-error'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'

let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: DeleteMedicineUseCase

describe('Delete Medicine', () => {
    beforeEach(() => {
        inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
        inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
        inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()

        inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
            inMemoryTherapeuticClassesRepository
        )
        inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
            inMemoryMedicinesRepository, inMemoryPharmaceuticalFormsRepository, inMemoryUnitsMeasureRepository
        )
        sut = new DeleteMedicineUseCase(inMemoryMedicinesRepository, inMemoryMedicinesVariantsRepository)
    })
    it('shoult be able delete a Medicine', async () => {
        const medicine = makeMedicine({
            content: 'Medicine 1',
        })
        await inMemoryMedicinesRepository.create(medicine)

        const result = await sut.execute({
            medicineId: medicine.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        if (result.isRight()) {
            expect(inMemoryMedicinesRepository.items).toHaveLength(0)
        }
    })

    it('shoult not be able delete a Medicine with dependency', async () => {
        const medicine = makeMedicine({
            content: 'Medicine 1',
        })
        await inMemoryMedicinesRepository.create(medicine)
        const pharmaceuticalForm = makePharmaceuticalForm()
        const unitMeasure = makeUnitMeasure()
        await Promise.all([
            inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm),
            inMemoryUnitsMeasureRepository.create(unitMeasure)
        ])

        const medicineVariant = makeMedicineVariant({
            medicineId: medicine.id,
            pharmaceuticalFormId: pharmaceuticalForm.id,
            unitMeasureId: unitMeasure.id,
        })
        await inMemoryMedicinesVariantsRepository.create(medicineVariant)

        const result = await sut.execute({
            medicineId: medicine.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(MedicineHasDependencyError)
    })
})
