import { describe, it, beforeEach, expect } from 'vitest';
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository';
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms';
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository';
import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository';
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository';
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository';
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository';
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository';
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository';
import { GetInventoryReportGroupedUseCase } from './get-inventory-report-grouped';
import { makeInstitution } from 'test/factories/make-insitution';
import { makeStock } from 'test/factories/make-stock';
import { makePharmaceuticalForm } from 'test/factories/make-pharmaceutical-form';
import { makeUnitMeasure } from 'test/factories/make-unit-measure';
import { makeMedicine } from 'test/factories/make-medicine';
import { makeMedicineVariant } from 'test/factories/make-medicine-variant';
import { makeMedicineStock } from 'test/factories/make-medicine-stock';

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
let sut: GetInventoryReportGroupedUseCase;

describe('Get Inventory Report Grouped', () => {
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

    sut = new GetInventoryReportGroupedUseCase(
      inMemoryMedicinesStockRepository,
    );
  });

  it('should group by stock and medicine (without batches)', async () => {
    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const stock = makeStock({ institutionId: institution.id });
    await inMemoryStocksRepository.create(stock);

    const pharmaceuticalForm = makePharmaceuticalForm();
    await inMemoryPharmaceuticalFormsRepository.create(pharmaceuticalForm);
    const unitMeasure = makeUnitMeasure();
    await inMemoryUnitsMeasureRepository.create(unitMeasure);
    const medicine = makeMedicine();
    await inMemoryMedicinesRepository.create(medicine);
    const variant = makeMedicineVariant({
      medicineId: medicine.id,
      pharmaceuticalFormId: pharmaceuticalForm.id,
      unitMeasureId: unitMeasure.id,
    });
    await inMemoryMedicinesVariantsRepository.create(variant);
    await inMemoryMedicinesRepository.addMedicinesVariantsId(
      medicine.id.toString(),
      variant.id.toString(),
    );
    const ms = makeMedicineStock({
      medicineVariantId: variant.id,
      stockId: stock.id,
      currentQuantity: 10,
    });
    await inMemoryMedicinesStockRepository.create(ms);

    const result = await sut.execute({
      institutionId: institution.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.stocks).toHaveLength(1);
    expect(result.value?.stocks[0].medicines).toHaveLength(1);
    expect(result.value?.stocks[0].medicines[0].medicineStocks).toHaveLength(1);
    expect(
      result.value?.stocks[0].medicines[0].medicineStocks[0].quantity.current,
    ).toBe(10);
  });
});


