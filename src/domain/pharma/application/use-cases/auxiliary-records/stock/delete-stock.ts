import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { StockAlreadyHasMovimentationError } from './_errors/stock-already-has-movimentation-error';
import { StocksRepository } from '../../../repositories/stocks-repository';
import { MedicinesEntriesRepository } from '../../../repositories/medicines-entries-repository';
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository';

interface deleteStockUseCaseRequest {
  stockId: string;
}

type deleteStockUseCaseResponse = Either<
  StockAlreadyHasMovimentationError | ResourceNotFoundError,
  null
>;

@Injectable()
export class DeleteStockUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private entriesRepository: MedicinesEntriesRepository,
    private exitsRepository: MedicinesExitsRepository,
  ) {}

  async execute({
    stockId,
  }: deleteStockUseCaseRequest): Promise<deleteStockUseCaseResponse> {
    const stock = await this.stocksRepository.findById(stockId);
    if (!stock) {
      return left(new ResourceNotFoundError('Estoque não encontrado'));
    }

    const hasEntries = await this.entriesRepository.findMany(
      { page: 1 },
      { stockId },
    );

    const hasExits = await this.exitsRepository.findMany(
      { page: 1 },
      { stockId },
    );

    if (hasEntries.entries.length > 0 || hasExits.medicinesExits.length > 0) {
      return left(new StockAlreadyHasMovimentationError());
    }

    await this.stocksRepository.delete(stockId);

    return right(null);
  }
}
