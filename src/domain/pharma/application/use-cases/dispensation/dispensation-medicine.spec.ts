import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository'
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository'
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository'
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository'
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

import { InMemoryDispensationsMedicinesRepository } from 'test/repositories/in-memory-dispensations-medicines-repository'
import { DispensationMedicineUseCase } from './dispensation-medicine'
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository'
import { makeBatch } from 'test/factories/make-batch'
import { makeBatchStock } from 'test/factories/make-batch-stock'
import { makePatient } from 'test/factories/make-patient'
import { InMemoryPatientsRepository } from 'test/repositories/in-memory-patients-repository'
import { makeMedicineStock } from 'test/factories/make-medicine-stock'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository'
import { makeManufacturer } from 'test/factories/make-manufacturer'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository'
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms'
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository'
import { makeMedicineVariant } from 'test/factories/make-medicine-variant'
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryPathologiesRepository } from 'test/repositories/in-memory-pathologies-repository'
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository'
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository'

let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryPathologiesRepository: InMemoryPathologiesRepository
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository
let inMemoryManufacturersRepository: InMemoryManufacturersRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryPatientsRepository: InMemoryPatientsRepository
let inMemoryStocksRepository: InMemoryStocksRepository
let inMemoryMedicinesRepository: InMemoryMedicinesRepository
let inMemoryBatchesRepository: InMemoryBatchesRepository
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryDispensationsMedicinesRepository: InMemoryDispensationsMedicinesRepository
let inMemoryMovimentationRepository: InMemoryMovimentationRepository
let sut: DispensationMedicineUseCase

describe('Dispensation Medicine', () => {
  beforeEach(() => {
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryPathologiesRepository = new InMemoryPathologiesRepository()
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

    inMemoryMovimentationRepository.setEntriesRepository(
      inMemoryMedicinesEntriesRepository,
    )
    inMemoryMovimentationRepository.setExitsRepository(
      inMemoryMedicinesExitsRepository,
    )

    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository()

    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository()
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository()
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository()
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryPatientsRepository = new InMemoryPatientsRepository(
      inMemoryAddressRepository,
      inMemoryPathologiesRepository,
    )
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    )
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    )
    inMemoryBatchesRepository = new InMemoryBatchesRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )

    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      )
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

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    )
    inMemoryDispensationsMedicinesRepository =
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

    sut = new DispensationMedicineUseCase(
      inMemoryDispensationsMedicinesRepository,
      inMemoryMedicinesExitsRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryMedicinesStockRepository,
      inMemoryBatchStocksRepository,
      inMemoryBatchesRepository,
      inMemoryMovimentationRepository,
    )
  })
  it('should be able to dispense a medication', async () => {
    const quantityToDispense = 10
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const stock = makeStock({ institutionId: institution.id })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      currentQuantity: 50,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const batch1 = makeBatch({
      manufacturerId: manufacturer.id,
    })

    const batch2 = makeBatch({
      manufacturerId: manufacturer.id,
    })
    await inMemoryBatchesRepository.create(batch1)
    await inMemoryBatchesRepository.create(batch2)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 20,
    })

    const batchestock2 = makeBatchStock({
      batchId: batch2.id,
      medicineStockId: medicineStock.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 30,
    })

    medicineStock.batchesStockIds = [batchestock1.id, batchestock2.id]

    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryBatchStocksRepository.create(batchestock2)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      medicines: [
        {
          medicineStockId: medicineStock.id.toString(),
          batchesStocks: [
            {
              batchStockId: batchestock1.id.toString(),
              quantity: quantityToDispense,
            },
            {
              batchStockId: batchestock2.id.toString(),
              quantity: quantityToDispense,
            },
          ],
        },
      ],
      stockId: stock.id.toString(),
      dispensationDate: new Date(),
      operatorId: 'operator-1',
      patientId: patient.id.toString(),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)
      expect(inMemoryMedicinesExitsRepository.items).toHaveLength(1)
      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(
        20 - (quantityToDispense),
      )
      expect(inMemoryBatchStocksRepository.items[1].quantity).toBe(
        30 - (quantityToDispense),
      )
    }
  })
  it('should not be able to dispense a medication with batch expired', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const date = new Date('2024-02-15')
    vi.setSystemTime(date)

    const quantityToDispense = 5
    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const manufacturer = makeManufacturer()
    await inMemoryManufacturersRepository.create(manufacturer)

    const stock = makeStock({
      institutionId: institution.id,
    })
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicine.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch({
      expirationDate: new Date('2024-02-15'),
    })
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 20,
    })
    medicineStock.batchesStockIds = [batchestock1.id]
    medicineStock.quantity = batchestock1.quantity

    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      operatorId: 'operator-1',
      stockId: stock.id.toString(),
      dispensationDate: new Date(),
      patientId: patient.id.toString(),
      medicines: [
        {
          medicineStockId: medicineStock.id.toString(),
          batchesStocks: [
            {
              batchStockId: batchestock1.id.toString(),
              quantity: quantityToDispense,
            },
          ],
        },
      ],
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(0)
      expect(inMemoryBatchStocksRepository.items[0]).toBe(20)
    }
  })
  it('should be able to dispense quantities of the same medication in different batches', async () => {
    const patient = makePatient()
    await inMemoryPatientsRepository.create(patient)

    const stock = makeStock()
    await inMemoryStocksRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicinesRepository.create(medicine)

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
    })
    await inMemoryMedicinesVariantsRepository.create(medicineVariant)

    const medicineStock = makeMedicineStock({
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
    })

    const batch1 = makeBatch()
    await inMemoryBatchesRepository.create(batch1)

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      medicineStockId: medicineStock.id,
      currentQuantity: 20,
    })

    const batch2 = makeBatch()
    await inMemoryBatchesRepository.create(batch2)

    const batchestock2 = makeBatchStock({
      batchId: batch2.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      medicineStockId: medicineStock.id,
      currentQuantity: 10,
    })

    medicineStock.batchesStockIds = [batchestock1.id, batchestock2.id]
    medicineStock.quantity = batchestock1.quantity + batchestock2.quantity

    await inMemoryBatchStocksRepository.create(batchestock1)
    await inMemoryBatchStocksRepository.create(batchestock2)
    await inMemoryMedicinesStockRepository.create(medicineStock)

    const result = await sut.execute({
      operatorId: 'operator-1',
      patientId: patient.id.toString(),
      stockId: stock.id.toString(),
      dispensationDate: new Date(),
      medicines: [
        {
          medicineStockId: medicineStock.id.toString(),
          batchesStocks: [
            {
              batchStockId: batchestock1.id.toString(),
              quantity: 5,
            },
            {
              batchStockId: batchestock2.id.toString(),
              quantity: 10,
            },
          ],
        },
      ],
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryDispensationsMedicinesRepository.items).toHaveLength(1)

      expect(inMemoryBatchStocksRepository.items[0].quantity).toBe(15)
      expect(inMemoryBatchStocksRepository.items[1].quantity).toBe(0)
    }
  })
})
