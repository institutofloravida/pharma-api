import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository';
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository';
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository';
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository';
import { InMemoryMedicinesExitsRepository } from 'test/repositories/in-memory-medicines-exits-repository';
import { makeStock } from 'test/factories/make-stock';
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository';
import { makeBatch } from 'test/factories/make-batch';
import { makeBatchStock } from 'test/factories/make-batch-stock';
import { makeMedicineStock } from 'test/factories/make-medicine-stock';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository';
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms';
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository';
import { makeInstitution } from 'test/factories/make-insitution';
import { makeMedicineVariant } from 'test/factories/make-medicine-variant';
import { InMemoryMovementTypesRepository } from 'test/repositories/in-memory-movement-types-repository';
import { makeMovementType } from 'test/factories/make-movement-type';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository';
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository';
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository';
import { InMemoryMovimentationRepository } from 'test/repositories/in-memory-movimentation-repository';
import { InMemoryMedicinesEntriesRepository } from 'test/repositories/in-memory-medicines-entries-repository';
import { makeOperator } from 'test/factories/make-operator';
import { makeMedicine } from 'test/factories/make-medicine';
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form';
import { makeUnitMeasure } from 'test/factories/make-unit-measure';
import { InMemoryTransferRepository } from 'test/repositories/in-memory-transfer-repository';
import { makeMedicineExit } from 'test/factories/make-medicine-exit';
import { makeMovimentation } from 'test/factories/make-movimentation';
import { makeTransfer } from 'test/factories/make-transfer';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';
import { GetTransferUseCase } from './get-transfer';
import { TransferWithMovimentation } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-with-movimentation';
import { makeManufacturer } from 'test/factories/make-manufacturer';

let inMemoryOperatorsRepository: InMemoryOperatorsRepository;
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository;
let inMemoryMovementTypesRepository: InMemoryMovementTypesRepository;
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository;
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository;
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository;
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository;
let inMemoryStocksRepository: InMemoryStocksRepository;
let inMemoryMedicinesExitsRepository: InMemoryMedicinesExitsRepository;
let inMemoryMedicinesRepository: InMemoryMedicinesRepository;
let inMemoryBatchesRepository: InMemoryBatchesRepository;
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository;
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository;
let inMemoryManufacturersRepository: InMemoryManufacturersRepository;
let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
let inMemoryMedicinesEntriesRepository: InMemoryMedicinesEntriesRepository;
let inMemoryTransferRepository: InMemoryTransferRepository;

let sut: GetTransferUseCase;

describe('Get Transfer', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository();
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    );
    inMemoryMovementTypesRepository = new InMemoryMovementTypesRepository();

    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository();
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    );

    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
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

    inMemoryMedicinesVariantsRepository =
      new InMemoryMedicinesVariantsRepository(
        inMemoryMedicinesRepository,
        inMemoryPharmaceuticalFormsRepository,
        inMemoryUnitsMeasureRepository,
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
    );

    inMemoryMovimentationRepository.setEntriesRepository(
      inMemoryMedicinesEntriesRepository,
    );
    inMemoryMovimentationRepository.setExitsRepository(
      inMemoryMedicinesExitsRepository,
    );

    inMemoryTransferRepository = new InMemoryTransferRepository(
      inMemoryOperatorsRepository,
      inMemoryStocksRepository,
      inMemoryMovimentationRepository,
      inMemoryMedicinesExitsRepository,
      inMemoryInstitutionsRepository,
      inMemoryBatchesRepository,
      inMemoryBatchStocksRepository,
      inMemoryManufacturersRepository,
    );

    sut = new GetTransferUseCase(inMemoryTransferRepository);
  });

  it('shoult be able to get a transfer', async () => {
    const quantityToExit = 5;

    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const institution2 = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution2);

    const operator = makeOperator({
      institutionsIds: [institution.id],
    });

    const operator2 = makeOperator({
      institutionsIds: [institution2.id],
    });
    await inMemoryOperatorsRepository.create(operator);
    await inMemoryOperatorsRepository.create(operator2);

    const movementType = makeMovementType({
      content: 'DONATION',
      direction: 'EXIT',
    });
    await inMemoryMovementTypesRepository.create(movementType);

    const stock = makeStock({ institutionId: institution.id });
    await inMemoryStocksRepository.create(stock);

    const stockDestination = makeStock({ institutionId: institution2.id });
    await inMemoryStocksRepository.create(stockDestination);

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
      batchesStockIds: [],
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      currentQuantity: 30,
    });

    const manufacturer = makeManufacturer();
    await inMemoryManufacturersRepository.create(manufacturer);

    const batch1 = makeBatch({
      manufacturerId: manufacturer.id,
    });
    await inMemoryBatchesRepository.create(batch1);

    const batchestock1 = makeBatchStock({
      batchId: batch1.id,
      medicineVariantId: medicineVariant.id,
      stockId: stock.id,
      medicineStockId: medicineStock.id,
      currentQuantity: 30,
    });

    await inMemoryMedicinesStockRepository.create(medicineStock);

    await inMemoryBatchStocksRepository.create(batchestock1);
    await inMemoryMedicinesStockRepository.addBatchStock(
      medicineStock.id.toString(),
      batchestock1.id.toString(),
    );
    const transfer = makeTransfer({
      status: TransferStatus.PENDING,
      stockDestinationId: stockDestination.id,
    });
    await inMemoryTransferRepository.create(transfer);

    const exit1 = makeMedicineExit({
      exitType: ExitType.MOVEMENT_TYPE,
      operatorId: operator.id,
      stockId: stock.id,
      movementTypeId: undefined,
      destinationInstitutionId: undefined,
      dispensationId: undefined,
      transferId: transfer.id,
      exitDate: new Date(),
    });

    await inMemoryMedicinesExitsRepository.create(exit1);
    await inMemoryMovimentationRepository.create(
      makeMovimentation({
        quantity: quantityToExit,
        batchStockId: batchestock1.id,
        exitId: exit1.id,
        direction: 'EXIT',
        entryId: undefined,
      }),
    );

    const result = await sut.execute({
      transferId: transfer.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.transfer).toBeInstanceOf(TransferWithMovimentation);
    }
  });
});
