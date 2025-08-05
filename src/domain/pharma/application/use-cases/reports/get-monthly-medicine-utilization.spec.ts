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
import { addDays } from 'date-fns';
import { makeMedicineExit } from 'test/factories/make-medicine-exit';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { makeUseMedicine } from 'test/factories/make-use-medicine';
import { InMemoryUseMedicinesRepository } from 'test/repositories/in-memory-use-medicines-repository';
import { GetMonthlyMedicineUtilizationUseCase } from './get-monthly-medicine-utilization';
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository';
import { makeMovimentation } from 'test/factories/make-movimentation';
import { EntryType } from '@/domain/pharma/enterprise/entities/entry';

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
let inMemoryUseMedicinesRepository: InMemoryUseMedicinesRepository;

let sut: GetMonthlyMedicineUtilizationUseCase;

describe('Get Monthly Medicine utilization', () => {
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

    inMemoryUseMedicinesRepository = new InMemoryUseMedicinesRepository(
      inMemoryMedicinesStockRepository,
      inMemoryStocksRepository,
      inMemoryInstitutionsRepository,
      inMemoryMedicinesExitsRepository,
      inMemoryMedicinesVariantsRepository,
      inMemoryMedicinesRepository,
      inMemoryPharmaceuticalFormsRepository,
      inMemoryUnitsMeasureRepository,
      inMemoryMovimentationRepository,
      inMemoryBatchStocksRepository,
    );

    sut = new GetMonthlyMedicineUtilizationUseCase(
      inMemoryUseMedicinesRepository,
    );
  });

  it('should be able to get monthly medicine utiization', async () => {
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

    const useMedicine = makeUseMedicine({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      currentBalance: 0,
      previousBalance: 0,
      used: 0,
      medicineStockId: medicineStock.id,
    });

    await inMemoryUseMedicinesRepository.create(useMedicine);

    const movementType = makeMovementType();
    await inMemoryMovementTypesRepository.create(movementType);
    vi.setSystemTime(addDays(new Date(), 5));
    const entry1 = makeMedicineEntry({
      operatorId: operator.id,
      stockId: stock.id,
      movementTypeId: movementType.id,
      entryType: EntryType.MOVEMENT_TYPE,
      transferId: undefined,
    });

    await inMemoryMedicinesEntriesRepository.create(entry1);

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,
        batchStockId: batchStock.id,
        direction: 'ENTRY',
        entryId: entry1.id,
        exitId: undefined,
      }),
    );
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        batchStockId: batchStock.id,
        direction: 'ENTRY',
        entryId: entry1.id,
        exitId: undefined,
      }),
    );
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 30,
        batchStockId: batchStock.id,
        direction: 'ENTRY',
        entryId: entry1.id,
        exitId: undefined,
      }),
    );
    vi.setSystemTime(addDays(new Date(), 9));

    const exit1 = makeMedicineExit({
      exitType: ExitType.MOVEMENT_TYPE,
      operatorId: operator.id,
      stockId: stock.id,
      destinationInstitutionId: undefined,
      dispensationId: undefined,
      movementTypeId: movementType.id,
      transferId: undefined,
    });

    const exit2 = makeMedicineExit({
      exitType: ExitType.MOVEMENT_TYPE,
      operatorId: operator.id,
      stockId: stock.id,
      destinationInstitutionId: undefined,
      dispensationId: undefined,
      movementTypeId: movementType.id,
      transferId: undefined,
    });
    await Promise.all([
      inMemoryMedicinesExitsRepository.create(exit1),
      inMemoryMedicinesExitsRepository.create(exit2),
    ]);

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 10,
        batchStockId: batchStock.id,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit1.id,
      }),
    );

    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: 20,
        batchStockId: batchStock.id,
        direction: 'EXIT',
        entryId: undefined,
        exitId: exit2.id,
      }),
    );

    vi.setSystemTime(new Date(2025, 0, 30));

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      year: 2025,
      month: 0,
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.totalUtilization).toEqual(30);
      expect(result.value.meta.totalCount).toBe(1);
    }
  });
});
