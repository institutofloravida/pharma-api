import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeInstitution } from 'test/factories/make-insitution'
import { makePatient } from 'test/factories/make-patient'
import { makeDispensation } from 'test/factories/make-dispensation'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makeMedicine } from 'test/factories/make-medicine'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form'
import { makeStock } from 'test/factories/make-stock'
import { makeUnitMeasure } from 'test/factories/make-unit-measure'
import { GetDispenseInAPeriodUseCase } from './get-dispenses-in-a-period-report'
import { makeOperator } from 'test/factories/make-operator'
import { makeMedicineExit } from 'test/factories/make-medicine-exit'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { makeManufacturer } from 'test/factories/make-manufacturer'

let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let inMemoryDispensationsRepository: InMemoryDispensationsMedicinesRepository
let sut: GetDispenseInAPeriodUseCase

describe('Get Dispense In A Period', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
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
    inMemoryBatchStocksRepository.setMedicinesStockRepository(
      inMemoryMedicinesStockRepository,
    )

    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
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
    inMemoryPatientsRepository = new InMemoryPatientsRepository()
    inMemoryDispensationsRepository =
      new InMemoryDispensationsMedicinesRepository(
        inMemoryMedicinesExitsRepository,
        inMemoryOperatorsRepository,
        inMemoryPatientsRepository,
        inMemoryMedicinesStockRepository,
        inMemoryStocksRepository,
      )

    inMemoryPatientsRepository.setDispensationsRepository(
      inMemoryDispensationsRepository,
    )

    sut = new GetDispenseInAPeriodUseCase(inMemoryDispensationsRepository)
  })

  it('should be able to get Dispense In A Period', async () => {
    const date = new Date(2025, 2, 1)
    vi.setSystemTime(date)

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
    const batch = makeBatch({
    })
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

    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const dispensation = makeDispensation({
      patientId: patient.id,
      dispensationDate: new Date(2025, 2, 14),
      createdAt: new Date(),
      operatorId: operator.id,
    })

    await inMemoryDispensationsRepository.create(dispensation)

    const dispensation2 = makeDispensation({
      patientId: patient.id,
      dispensationDate: new Date(2025, 2, 14),
      createdAt: new Date(),
      operatorId: operator.id,
    })

    await inMemoryDispensationsRepository.create(dispensation2)

    await inMemoryMedicinesExitsRepository.create(
      makeMedicineExit({
        quantity: 10,
        batchestockId: batchStock.id,
        movementTypeId: undefined,
        exitType: ExitType.DISPENSATION,
        dispensationId: dispensation.id,
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
        exitDate: new Date(2025, 2, 14),

      }),
    )
    await inMemoryMedicinesExitsRepository.create(
      makeMedicineExit({
        quantity: 20,
        batchestockId: batchStock.id,
        movementTypeId: undefined,

        exitType: ExitType.DISPENSATION,
        dispensationId: dispensation2.id,
        exitDate: new Date(2025, 2, 14),
        medicineStockId: medicineStock.id,
        operatorId: operator.id,
      }),
    )
    vi.setSystemTime(new Date(2025, 2, 28))

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      endDate: new Date(2025, 2, 14),
      startDate: new Date(2025, 2, 1),
    })
    expect(result.value?.meta.totalCount).toBe(2)
  })
})
