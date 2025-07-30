import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { DeletePharmaceuticalFormUseCase } from './delete-pharmaceutical-form'
import { PharmaceuticalFormHasDependencyError } from './_errors/pharmaceutical-form-has-dependency-error'

let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let sut: DeletePharmaceuticalFormUseCase

describe('Delete Pharmaceutical Form', () => {
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
        sut = new DeletePharmaceuticalFormUseCase(inMemoryPharmaceuticalFormsRepository, inMemoryMedicinesVariantsRepository)
    })
    it('shoult be able delete a Pharmaceutical Form', async () => {
        const pharmaceuticalForm = makePharmaceuticalForm()
        await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm)

        const result = await sut.execute({
            pharmaceuticalFormId: pharmaceuticalForm.id.toString()
        })

        expect(result.isRight()).toBeTruthy()
        if (result.isRight()) {
            expect(inMemoryPharmaceuticalFormsRepository.items).toHaveLength(0)
        }
    })

    it('shoult not be able delete a pharmaceutical form with dependency', async () => {
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
            pharmaceuticalFormId: pharmaceuticalForm.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(PharmaceuticalFormHasDependencyError)
    })
})
