import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { StocksRepository } from '../../../repositories/stocks-repository';

interface activateStockUseCaseRequest {
  stockId: string;
}

type activateStockUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class ActivateStockUseCase {
  constructor(private stockRepository: StocksRepository) {}

  async execute({
    stockId,
  }: activateStockUseCaseRequest): Promise<activateStockUseCaseResponse> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return left(new ResourceNotFoundError('Operador não encontrado'));
    }

    stock.activate();
    await this.stockRepository.save(stock);

    return right(null);
  }
}
