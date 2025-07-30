import { makeMedicine } from 'test/factories/make-medicine'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { makeBatch } from 'test/factories/make-batch'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { DeleteMedicineVariantUseCase } from './delete-medicine-variant'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { MedicineVariantHasDependencyError } from './_errors/medicine-variant-has-dependency-error'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeStock } from 'test/factories/make-stock'
import { makeInstitution } from 'test/factories/make-insitution'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let sut: DeleteMedicineVariantUseCase

describe('Delete Medicine Variant', () => {
    beforeEach(() => {
        inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
        inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
        inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
        inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
        inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()

        inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
            inMemoryTherapeuticClassesRepository
        )
        inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
            inMemoryMedicinesRepository, inMemoryPharmaceuticalFormsRepository, inMemoryUnitsMeasureRepository
        )
        inMemoryStocksRepository = new InMemoryStocksRepository(
              inMemoryInstitutionsRepository,
            )
        inMemoryBatchesRepository = new InMemoryBatchesRepository()
            inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository(
              inMemoryBatchesRepository,
              inMemoryMedicinesRepository,
              inMemoryMedicinesVariantsRepository,
              inMemoryStocksRepository,
              inMemoryUnitsMeasureRepository,
              inMemoryPharmaceuticalFormsRepository,
            )
            inMemoryMedicinesStockRepository = new InMemoryMedicinesStockRepository(
              inMemoryInstitutionsRepository,
              inMemoryStocksRepository,
              inMemoryMedicinesRepository,
              inMemoryMedicinesVariantsRepository,
              inMemoryUnitsMeasureRepository,
              inMemoryPharmaceuticalFormsRepository,
              inMemoryBatchStocksRepository,
              inMemoryBatchesRepository,
              inMemoryManufacturersRepository,
            )
            inMemoryBatchStocksRepository.setMedicinesStockRepository(inMemoryMedicinesStockRepository)
        sut = new DeleteMedicineVariantUseCase( inMemoryMedicinesVariantsRepository, inMemoryMedicinesStockRepository)
    })
    it('shoult be able delete a Medicine Variant', async () => {
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
            medicineVariantId: medicineVariant.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        if (result.isRight()) {
            expect(inMemoryMedicinesVariantsRepository.items).toHaveLength(0)
        }
    })

    it('shoult not be able delete a Medicine with dependency', async () => {
        const institution = makeInstitution({})
        await inMemoryInstitutionsRepository.create(institution)
        const pharmaceuticalForm = makePharmaceuticalForm()
        const unitMeasure = makeUnitMeasure()
        await Promise.all([
            inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm),
            inMemoryUnitsMeasureRepository.create(unitMeasure)
        ])
        
        const medicine = makeMedicine({
            content: 'Medicine 1',
        })
        
        const medicineVariant = makeMedicineVariant({
            medicineId: medicine.id,
            pharmaceuticalFormId: pharmaceuticalForm.id,
            unitMeasureId: unitMeasure.id,
        })
        medicine.medicinesVariantsIds = [medicineVariant.id]
        
        await inMemoryMedicinesRepository.create(medicine)
        await inMemoryMedicinesVariantsRepository.create(medicineVariant)
        const stock = makeStock({
            institutionId: institution.id,
        })
        await inMemoryStocksRepository.create(stock)

        const medicineStock = makeMedicineStock({
            batchesStockIds: [],
            currentQuantity: 0,
            medicineVariantId: medicineVariant.id,
            stockId: stock.id,
        })
        await inMemoryMedicinesStockRepository.create(medicineStock)

        const result = await sut.execute({
            medicineVariantId: medicineVariant.id.toString()
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(MedicineVariantHasDependencyError)
    })
})
