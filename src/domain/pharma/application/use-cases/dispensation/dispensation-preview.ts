import { left, right, type Either } from '@/core/either';
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository';
import { InsufficientQuantityInStockError } from '../_errors/insufficient-quantity-in-stock-error';
import { Injectable } from '@nestjs/common';
import { BatchStocksRepository } from '../../repositories/batch-stocks-repository';
import { MedicineStockNotFoundError } from '../stock/medicine-stock/_errors/medicine-stock-not-found-error';

interface DispensationPreviewUseCaseRequest {
  medicineStockId: string;
  quantityRequired: number;
}

export interface DispensationBatchPreview {
  batchStockId: string;
  code: string;
  quantity: {
    toDispensation: number;
    totalCurrent: number;
  };
  manufacturer: string;
  expirationDate: Date;
  isExpired: boolean;
}

type DispensationPreviewUseCaseResponse = Either<
  MedicineStockNotFoundError | InsufficientQuantityInStockError,
  {
    batchesPreview: DispensationBatchPreview[];
  }
>;

@Injectable()
export class DispensationPreviewUseCase {
  constructor(
    private medicinesStockRepository: MedicinesStockRepository,
    private batchesStockRepository: BatchStocksRepository,
  ) {}

  async execute({
    medicineStockId,
    quantityRequired,
  }: DispensationPreviewUseCaseRequest): Promise<DispensationPreviewUseCaseResponse> {
    const medicineStock =
      await this.medicinesStockRepository.findById(medicineStockId);
    if (!medicineStock) {
      return left(new MedicineStockNotFoundError(medicineStockId));
    }

    if (medicineStock.quantity < quantityRequired) {
      return left(
        new InsufficientQuantityInStockError(
          medicineStockId,
          medicineStock.quantity,
        ),
      );
    }

    const batchesPreview: DispensationBatchPreview[] = [];

    let remainingQuantity = quantityRequired;
    const { batchesStock } = await this.batchesStockRepository.findMany(
      { page: 1 },
      { medicineStockId, includeExpired: false },
      false,
    );

    for await (const batchStock of batchesStock) {
      const rest = batchStock.quantity - remainingQuantity;
      const today = new Date();
      const expirationDate = new Date(batchStock.expirationDate);

      today.setHours(0, 0, 0, 0);
      expirationDate.setHours(0, 0, 0, 0);

      batchesPreview.push({
        batchStockId: batchStock.id.toString(),
        code: batchStock.batch,
        expirationDate: batchStock.expirationDate,
        quantity: {
          toDispensation: rest > 0 ? remainingQuantity : batchStock.quantity,
          totalCurrent: batchStock.quantity,
        },
        manufacturer: batchStock.manufacturer,
        isExpired: today > expirationDate,
      });
      if (rest >= 0) {
        remainingQuantity = 0;
        break;
      } else {
        remainingQuantity -= batchStock.quantity;
      }
    }
    return right({ batchesPreview });
  }
}
