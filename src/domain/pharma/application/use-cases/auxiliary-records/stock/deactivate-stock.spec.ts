import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { makeStock } from 'test/factories/make-stock';
import { makeInstitution } from 'test/factories/make-insitution';
import { DeactivateStockUseCase } from './deactivate-stock';
import { InMemoryBatchStocksRepository } from 'test/repositories/in-memory-batch-stocks-repository';
import { InMemoryBatchesRepository } from 'test/repositories/in-memory-batches-repository';
import { InMemoryManufacturersRepository } from 'test/repositories/in-memory-manufacturers-repository';
import { InMemoryMedicinesRepository } from 'test/repositories/in-memory-medicines-repository';
import { InMemoryMedicinesStockRepository } from 'test/repositories/in-memory-medicines-stock-repository';
import { InMemoryMedicinesVariantsRepository } from 'test/repositories/in-memory-medicines-variants-repository';
import { InMemoryPharmaceuticalFormsRepository } from 'test/repositories/in-memory-pharmaceutical-forms';
import { InMemoryTherapeuticClassesRepository } from 'test/repositories/in-memory-therapeutic-classes-repository';
import { InMemoryUnitsMeasureRepository } from 'test/repositories/in-memory-units-measure-repository';

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository;
let inMemoryStocksRepository: InMemoryStocksRepository;
let inMemoryTherapeuticClassesRepository: InMemoryTherapeuticClassesRepository;
let inMemoryMedicinesRepository: InMemoryMedicinesRepository;
let inMemoryPharmaceuticalFormsRepository: InMemoryPharmaceuticalFormsRepository;
let inMemoryUnitsMeasureRepository: InMemoryUnitsMeasureRepository;
let inMemoryMedicinesStockRepository: InMemoryMedicinesStockRepository;
let inMemoryMedicinesVariantsRepository: InMemoryMedicinesVariantsRepository;
let inMemoryBatchStocksRepository: InMemoryBatchStocksRepository;
let inMemoryBatchesRepository: InMemoryBatchesRepository;
let inMemoryManufacturersRepository: InMemoryManufacturersRepository;
let sut: DeactivateStockUseCase;

describe('Deactivate Stock', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    );
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();

    inMemoryTherapeuticClassesRepository =
      new InMemoryTherapeuticClassesRepository();
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

    sut = new DeactivateStockUseCase(
      inMemoryStocksRepository,
      inMemoryMedicinesStockRepository,
    );
  });
  it('should be able deactivate a stock', async () => {
    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const stock = makeStock({
      status: true,
      institutionId: institution.id,
    });
    await inMemoryStocksRepository.create(stock);

    const result = await sut.execute({
      stockId: stock.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1);
      expect(inMemoryStocksRepository.items[0].status).toBe(false);
    }
  });
});
