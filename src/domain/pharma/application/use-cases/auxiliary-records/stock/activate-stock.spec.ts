import { InMemoryStocksRepository } from 'test/repositories/in-memory-stocks-repository';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { makeStock } from 'test/factories/make-stock';
import { makeInstitution } from 'test/factories/make-insitution';
import { ActivateStockUseCase } from './activate-stock';

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository;
let inMemoryStocksRepository: InMemoryStocksRepository;
let sut: ActivateStockUseCase;

describe('Activate Stock', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository(
      inMemoryInstitutionsRepository,
    );
    sut = new ActivateStockUseCase(inMemoryStocksRepository);
  });
  it('should be able activate a stock', async () => {
    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const stock = makeStock({
      status: false,
      institutionId: institution.id,
    });
    await inMemoryStocksRepository.create(stock);

    const result = await sut.execute({
      stockId: stock.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryStocksRepository.items).toHaveLength(1);
      expect(inMemoryStocksRepository.items[0].isActive).toBe(true);
    }
  });
});
