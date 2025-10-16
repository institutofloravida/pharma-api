import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository';
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository';
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms';
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository';
import { makeMedicineVariant } from 'test/factories/make-medicine-variant';
import { makeMedicine } from 'test/factories/make-medicine';
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form';
import { makeUnitMeasure } from 'test/factories/make-unit-measure';
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository';
import { makeInstitution } from 'test/factories/make-insitution';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository';
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository';
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository';
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository';
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository';
import { makeStock } from 'test/factories/make-stock';
import { makeMovementType } from 'test/factories/make-movement-type';
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository';
import { makeMedicineEntry } from 'test/factories/make-medicine-entry';
import { makeMedicineStock } from 'test/factories/make-medicine-stock';
import { makeBatch } from 'test/factories/make-batch';
import { makeBatchStock } from 'test/factories/make-batch-stock';
import { makeOperator } from 'test/factories/make-operator';
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository';
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository';
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository';
import { makeMovimentation } from 'test/factories/make-movimentation';
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository';
import { EntryType } from '@/domain/pharma/enterprise/entities/entry';
import { GetEntryDetailsUseCase } from './get-entry-details';
import { EntryDetails } from '@/domain/pharma/enterprise/entities/value-objects/entry-details';
import { makeManufacturer } from 'test/factories/make-manufacturer';

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository;
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository;
let inMemoryStocksRepository: InMemoryStocksRepository;
let inMemoryOperatorsRepository: InMemoryOperatorsRepository;
let inMemoryBatchesRepository: InMemoryBatchesRepository;
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository;
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository;
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository;
let inMemoryMedicinesRepository: InMemoryMedicinesRepository;
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository;
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository;
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository;
let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository;
let inMemoryManufacturersRepository: InMemoryManufacturersRepository;
let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository;

let sut: GetEntryDetailsUseCase;
describe('Get Entry Details', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository();
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository();
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();

    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    );
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    );
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository();
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository();
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    );
    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
      );
    inMemoryManufacturersRepository = new InMemoryManufacturersRepository();

    inMemoryBatchesRepository = new InMemoryBatchesRepository();
    inMemoryBatchStocksRepository = new InMemoryBatchStocksRepository(
      inMemoryBatchesRepository,
      inMemoryMedicinesRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryStocksRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryPharmaceuticalFormsRepository,
    );
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
    );
    inMemoryBatchStocksRepository.setMedicinesStockRepository(
      inMemoryMedicinesStockRepository,
    );
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
    );

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    );

    inMemoryMedicinesEntriesRepository = new InMemoryMedicinesEntriesRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
      inMemoryMovementTypesRepository,
      inMemoryBatchStocksRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryBatchesRepository,
      inMemoryManufacturersRepository,
    );

    inMemoryMovimentationRepository.setEntriesRepository(
      inMemoryMedicinesEntriesRepository,
    );
    inMemoryMovimentationRepository.setExitsRepository(
      inMemoryMedicinesExitsRepository,
    );

    sut = new GetEntryDetailsUseCase(inMemoryMedicinesEntriesRepository);
  });

  it('should be able to get an entry details', async () => {
    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const operator = makeOperator({
      institutionsIds: [institution.id],
    });
    await inMemoryOperatorsRepository.create(operator);

    const stock = makeStock({
      institutionId: institution.id,
    });
    await inMemoryStocksRepository.create(stock);

    const medicine = makeMedicine();
    await inMemoryMedicinesRepository.create(medicine);

    const pharmaceuticalForm = makePharmaceuticalForm();
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm);

    const unitMeasure = makeUnitMeasure();
    await inMemoryUnitsMeasureRepository.create(unitMeasure);

    const manufacturer = makeManufacturer();
    await inMemoryManufacturersRepository.create(manufacturer);

    const medicineVariant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    });
    await inMemoryMedicinesVariantsRepository.create(medicineVariant);

    const medicineStock = makeMedicineStock({
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      batchesStockIds: [],
    });
    const batch = makeBatch({
      manufacturerId: manufacturer.id,
    });
    await inMemoryBatchesRepository.create(batch);

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 0,
      medicineVariantId: medicineVariant.id,
      medicineStockId: medicineStock.id,
      stockId: stock.id,
    });
    await inMemoryBatchStocksRepository.create(batchStock);

    medicineStock.addBatchStockId(batchStock.id);

    await inMemoryMedicinesStockRepository.create(medicineStock);

    const movementType = makeMovementType();
    await inMemoryMovementTypesRepository.create(movementType);

    const entry = makeMedicineEntry({
      operatorId: operator.id,
      stockId: stock.id,
      movementTypeId: movementType.id,
      entryType: EntryType.MOVEMENT_TYPE,
      transferId: undefined,
    });
    await inMemoryMedicinesEntriesRepository.create(entry);

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,
        batchStockId: batchStock.id,
        direction: 'ENTRY',
        entryId: entry.id,
        exitId: undefined,
      }),
    );
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        batchStockId: batchStock.id,
        direction: 'ENTRY',
        entryId: entry.id,
        exitId: undefined,
      }),
    );
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 30,
        batchStockId: batchStock.id,
        direction: 'ENTRY',
        entryId: entry.id,
        exitId: undefined,
      }),
    );

    const result = await sut.execute({
      entryId: entry.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.entry).toBeInstanceOf(EntryDetails);
      expect(result.value.entry).toMatchObject({
        operator: operator.name,
        medicines: expect.arrayContaining([
          expect.objectContaining({
            medicineStockId: medicineStock.id.toString(),
            batches: expect.arrayContaining([
              expect.objectContaining({
                batchNumber: batch.code,
                quantity: 10,
              }),
            ]),
          }),
        ]),
      });
    }
  });
});
