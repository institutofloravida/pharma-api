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
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository';
import { makeMedicineExit } from 'test/factories/make-medicine-exit';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository';
import { makeMovimentation } from 'test/factories/make-movimentation';
import { EntryType } from '@/domain/pharma/enterprise/entities/entry';
import { FetchMovimentationUseCase } from './fetch-movimentation';

let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
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
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository;

let sut: FetchMovimentationUseCase;
describe('Fetch Movimentation', () => {
  beforeEach(() => {
    vi.useFakeTimers();

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

    inMemoryMedicinesEntriesRepository = new InMemoryMedicinesEntriesRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    );

    inMemoryMedicinesExitsRepository = new InMemoryMedicinesExitsRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
    );

    inMemoryMovimentationRepository.setEntriesRepository(
      inMemoryMedicinesEntriesRepository,
    );
    inMemoryMovimentationRepository.setExitsRepository(
      inMemoryMedicinesExitsRepository,
    );

    sut = new FetchMovimentationUseCase(inMemoryMovimentationRepository);
  });

  it('should be able to get movimentation in a period', async () => {
    const date = new Date(2025, 0, 1);
    vi.setSystemTime(date);

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
    const batch = makeBatch();
    await inMemoryBatchesRepository.create(batch);

    const batchStock = makeBatchStock({
      batchId: batch.id,
      currentQuantity: 0,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      medicineStockId: medicineStock.id,
    });
    await inMemoryBatchStocksRepository.create(batchStock);

    medicineStock.addBatchStockId(batchStock.id);

    await inMemoryMedicinesStockRepository.create(medicineStock);

    const movementType = makeMovementType();
    await inMemoryMovementTypesRepository.create(movementType);

    const entry = makeMedicineEntry({
      operatorId: operator.id,
      stockId: stock.id,
      entryType: EntryType.MOVEMENT_TYPE,
      movementTypeId: movementType.id,
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

    const exit1 = makeMedicineExit({
      operatorId: operator.id,
      stockId: stock.id,
      dispensationId: undefined,
      movementTypeId: movementType.id,
      exitType: ExitType.MOVEMENT_TYPE,
    });
    const exit2 = makeMedicineExit({
      operatorId: operator.id,
      dispensationId: undefined,
      movementTypeId: movementType.id,
      stockId: stock.id,
      exitType: ExitType.MOVEMENT_TYPE,
    });

    await Promise.all([
      inMemoryMedicinesExitsRepository.create(exit1),
      inMemoryMedicinesExitsRepository.create(exit2),
    ]);

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit1.id,
        batchStockId: batchStock.id,
      }),
    );

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit2.id,
        batchStockId: batchStock.id,
      }),
    );

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      page: 1,
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.meta).toEqual(
        expect.objectContaining({ totalCount: 5 }),
      );
    }
  });
});
