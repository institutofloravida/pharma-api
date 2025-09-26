import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { StocksRepository } from '../../../repositories/stocks-repository';
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository';
import { StockHasUnitsMedicinesError } from './_errors/stock-has-units-medicines-error';

interface deactivateStockUseCaseRequest {
  stockId: string;
}

type deactivateStockUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeactivateStockUseCase {
  constructor(
    private stockRepository: StocksRepository,
    private medicinesStockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    stockId,
  }: deactivateStockUseCaseRequest): Promise<deactivateStockUseCaseResponse> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return left(new ResourceNotFoundError('Estoque não encontrado'));
    }

    const stockIsZero = await this.medicinesStockRepository.stockIsZero(
      stock.id.toString(),
    );
    if (!stockIsZero) {
      return left(new StockHasUnitsMedicinesError());
    }

    stock.deactivate();
    await this.stockRepository.save(stock);

    return right(null);
  }
}
