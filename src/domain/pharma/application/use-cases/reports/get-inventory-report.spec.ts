import { makeStock } from 'test/factories/make-stock';
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { makeInstitution } from 'test/factories/make-insitution';
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository';
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository';
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms';
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository';
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository';
import { makeMedicine } from 'test/factories/make-medicine';
import { makeMedicineVariant } from 'test/factories/make-medicine-variant';
import { makeMedicineStock } from 'test/factories/make-medicine-stock';
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form';
import { makeUnitMeasure } from 'test/factories/make-unit-measure';
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository';
import { GetInventoryReportUseCase } from './get-inventory-report';
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository';
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository';
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository';
import { describe, it, beforeEach, expect } from 'vitest';

let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository;
let inMemoryMedicinesRepository: InMemoryMedicinesRepository;
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository;
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository;
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository;
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository;
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository;
let inMemoryStocksRepository: InMemoryStocksRepository;
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository;
let inMemoryBatchesRepository: InMemoryBatchesRepository;
let inMemoryManufacturersRepository: InMemoryManufacturersRepository;
let sut: GetInventoryReportUseCase;

describe('Get Inventory Report', () => {
  beforeEach(() => {
    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository();
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();
    inMemoryUnitsMeasureRepository = new InMemoryUnitsMeasureRepository();
    inMemoryPharmaceuticalFormsRepository =
      new InMemoryPharmaceuticalFormsRepository();
    inMemoryMedicinesRepository = new InMemoryMedicinesRepository(
      inMemoryTherapeuticClassesRepository,
    );
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
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

    sut = new GetInventoryReportUseCase(inMemoryMedicinesStockRepository);
  });

  it('should list all inventory without pagination', async () => {
    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const stock = makeStock({
      institutionId: institution.id,
    });
    await inMemoryStocksRepository.create(stock);

    const pharmaceuticalForm = makePharmaceuticalForm();
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm);

    const unitMeasure = makeUnitMeasure();
    await inMemoryUnitsMeasureRepository.create(unitMeasure);

    for (let index = 0; index < 12; index++) {
      const medicine = makeMedicine({
        content: `Medicine ${index}`,
      });
      await inMemoryMedicinesRepository.create(medicine);

      const medicineVariant = makeMedicineVariant({
        medicineId: medicine.id,
        pharmaceuticalFormId: pharmaceuticalForm.id,
        unitMeasureId: unitMeasure.id,
      });
      await inMemoryMedicinesVariantsRepository.create(medicineVariant);
      await inMemoryMedicinesRepository.addMedicinesVariantsId(
        medicine.id.toString(),
        medicineVariant.id.toString(),
      );

      const medicineStock = makeMedicineStock({
        medicineVariantId: medicineVariant.id,
        stockId: stock.id,
        currentQuantity: index + 1,
      });

      await inMemoryMedicinesStockRepository.create(medicineStock);
    }

    const result = await sut.execute({
      institutionId: institution.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.inventory).toHaveLength(12);
    expect(result.value?.meta.totalCount).toBe(12);
  });
});
