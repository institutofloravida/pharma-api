import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makeMedicine } from 'test/factories/make-medicine'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMovementType } from 'test/factories/make-movement-type'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeOperator } from 'test/factories/make-operator'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { FetchMedicinesExitsUseCase } from './fetch-exits'
import { makeMedicineExit } from 'test/factories/make-medicine-exit'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository

let sut: FetchMedicinesExitsUseCase
describe('Fetch  Medicines Exits', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository = new InMemoryTherapeuticClassesRepository()
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    inMemoryStocksRepository = new InMemoryStocksRepository(inMemoryInstitutionsRepository)
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(inMemoryInstitutionsRepository)
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository = new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(inMemoryTherapeuticClassesRepository)
    inMemoryMedicinesVariantsRepository = new InMemoryMedicinesVariantsRepository(
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
    )
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()

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

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
      inMemoryOperatorsRepository,
      inMemoryMovementTypesRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryStocksRepository,
      inMemoryMedicinesStockRepository,
    )

    sut = new FetchMedicinesExitsUseCase(inMemoryMedicinesExitsRepository)
  })

  it('should be able to fetch medicines exits', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

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

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      batchesStockIds: [],
      currentQuantity: 50,
    })
    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 80,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      medicineStockId: medicineStock.id,
    })
    await inMemoryBatchStocksRepository.create(batchStock)

    medicineStock.addBatchStockId(batchStock.id)

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const movementType = makeMovementType()
    await inMemoryMovementTypesRepository.create(movementType)

    await inMemoryMedicinesExitsRepository.create(
      makeMedicineExit({
        quantity: 10,
        batchestockId: batchStock.id,
        movementTypeId: movementType.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )
    await inMemoryMedicinesExitsRepository.create(
      makeMedicineExit({
        quantity: 20,
        batchestockId: batchStock.id,
        movementTypeId: movementType.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )
    await inMemoryMedicinesExitsRepository.create(
      makeMedicineExit({
        quantity: 30,
        batchestockId: batchStock.id,
        movementTypeId: movementType.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      page: 1,
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.medicinesExits).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated medicines exits', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator)

    const operator2 = makeOperator({
      institutionsIds: [institution.id],
    })
    await inMemoryOperatorsRepository.create(operator2)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

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

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      batchesStockIds: [],
    })
    const batch = makeBatch()
    await inMemoryBatchesRepository.create(batch)

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 0,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })
    await inMemoryBatchStocksRepository.create(batchStock)

    medicineStock.addBatchStockId(batchStock.id)

    await inMemoryMedicinesStockRepository.create(medicineStock)

    const movementType = makeMovementType({ content: 'DONATION' })
    await inMemoryMovementTypesRepository.create(movementType)

    const movementType2 = makeMovementType({ content: 'THEFT' })
    await inMemoryMovementTypesRepository.create(movementType2)

    for (let i = 1; i <= 22; i++) {
      await inMemoryMedicinesExitsRepository.create(
        makeMedicineExit({
          batchestockId: batchStock.id,
          movementTypeId: movementType.id,
          medicineStockId: medicineStock.id,
          operatorId: operator.id,
          exitType: ExitType.MOVEMENT_TYPE,
        }),
      )
    }

    for (let i = 1; i <= 5; i++) {
      await inMemoryMedicinesExitsRepository.create(
        makeMedicineExit({
          batchestockId: batchStock.id,
          movementTypeId: movementType2.id,
          medicineStockId: medicineStock.id,
          operatorId: operator2.id,
          exitType: ExitType.MOVEMENT_TYPE,

        }),
      )
    }

    const result = await sut.execute({
      page: 3,
      institutionId: institution.id.toString(),
    })
    const result2 = await sut.execute({
      page: 1,
      institutionId: institution.id.toString(),
      movementTypeId: movementType2.id.toString(),
    })
    if (result.isRight() && result2.isRight()) {
      expect(result.value?.medicinesExits).toHaveLength(7)
      expect(result2.value?.medicinesExits).toHaveLength(5)
    }
  })
})
