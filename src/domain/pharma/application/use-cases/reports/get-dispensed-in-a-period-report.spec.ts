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
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository'
import { makeMovimentation } from 'test/factories/make-movimentation'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'

let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryMovimentationRepository: InMemoryMovimentationRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
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
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: GetDispenseInAPeriodUseCase

describe('Get Dispense In A Period', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()

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
    inMemoryPatientsRepository = new InMemoryPatientsRepository(inMemoryAddressRepository, inMemoryPathologiesRepository)
    inMemoryAddressRepository = new InMemoryAddressRepository()

    inMemoryMovimentationRepository = new InMemoryMovimentationRepository(
      inMemoryOperatorsRepository,
      inMemoryMedicinesStockRepository,
      inMemoryStocksRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryBatchesRepository,
      inMemoryBatchStocksRepository,
      inMemoryMovementTypesRepository,
    )

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )

    inMemoryMedicinesEntriesRepository = new InMemoryMedicinesEntriesRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )

    inMemoryMovimentationRepository.setEntriesRepository(inMemoryMedicinesEntriesRepository)
    inMemoryMovimentationRepository.setExitsRepository(inMemoryMedicinesExitsRepository)
    inMemoryDispensationsRepository =
      new InMemoryDispensationsMedicinesRepository(
        inMemoryMedicinesExitsRepository,
        inMemoryOperatorsRepository,
        inMemoryPatientsRepository,
        inMemoryMedicinesStockRepository,
        inMemoryStocksRepository,
        inMemoryPathologiesRepository,
        inMemoryMedicinesRepository,
        inMemoryMedicinesVariantsRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
        inMemoryMovimentationRepository,
        inMemoryBatchStocksRepository,
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
      currentQuantity: 80,
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

    const exit1 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      dispensationId: dispensation.id,
      stockId: stock.id,
    })

    const exit2 = makeMedicineExit({
      exitType: ExitType.DISPENSATION,
      operatorId: operator.id,
      stockId: stock.id,
      dispensationId: dispensation2.id,
    })

    await Promise.all([
      inMemoryMedicinesExitsRepository.create(exit1),
      inMemoryMedicinesExitsRepository.create(exit2),
    ])

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,
        batchStockId: batchStock.id,
        movementTypeId: undefined,

        direction: 'EXIT',
        entryId: undefined,
        exitId: exit1.id,

      }),
    )
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        batchStockId: batchStock.id,
        movementTypeId: undefined,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit2.id,
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
