import { left, right, type Either } from '@/core/either';
import { Stock } from '../../../../enterprise/entities/stock';
import { Injectable } from '@nestjs/common';
import { StockAlreadyExistsError } from './_errors/stock-already-exists-error';
import { StockNotFoundError } from './_errors/stock-not-found-error';
import { StocksRepository } from '../../../repositories/stocks-repository';
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository';
import { StockHasUnitsMedicinesError } from './_errors/stock-has-units-medicines-error';

interface updateStockUseCaseRequest {
  stockId: string;
  content?: string;
  status?: boolean;
}

type updateStockUseCaseResponse = Either<
  StockAlreadyExistsError | StockNotFoundError,
  {
    stock: Stock;
  }
>;

@Injectable()
export class UpdateStockUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private medicinesStockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    content,
    status,
    stockId,
  }: updateStockUseCaseRequest): Promise<updateStockUseCaseResponse> {
    const stock = await this.stocksRepository.findById(stockId);
    if (!stock) {
      return left(new StockNotFoundError(stockId));
    }

    if (content) {
      const stockWithSameContent = await this.stocksRepository.findByContent(
        content,
        stock.institutionId.toString(),
      );
      if (stockWithSameContent && !stock.id.equal(stockWithSameContent.id)) {
        return left(new StockAlreadyExistsError(content));
      }
      stock.content = content;
    }
    if (status === false) {
      const stockIsZero = await this.medicinesStockRepository.stockIsZero(
        stock.id.toString(),
      );
      if (!stockIsZero) {
        status = true;
        return left(new StockHasUnitsMedicinesError());
      }
      stock.status = status;
    }

    await this.stocksRepository.save(stock);
    return right({
      stock,
    });
  }
}
