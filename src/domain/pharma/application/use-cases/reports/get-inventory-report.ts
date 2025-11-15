import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository';
import { MedicineStockInventory } from '@/domain/pharma/enterprise/entities/medicine-stock-inventory';
import { MetaReport } from '@/core/repositories/meta';

interface GetInventoryReportUseCaseRequest {
  institutionId: string;
  stockId?: string;
  medicineName?: string;
  therapeuticClasses?: string[];
  isCloseToExpiring?: boolean;
  isLowStock?: boolean;
}

type GetInventoryReportUseCaseResponse = Either<
  null,
  {
    inventory: MedicineStockInventory[];
    meta: MetaReport;
  }
>;

@Injectable()
export class GetInventoryReportUseCase {
  constructor(private medicinesStockRepository: MedicinesStockRepository) {}

  async execute({
    institutionId,
    stockId,
    medicineName,
    therapeuticClasses,
    isCloseToExpiring,
    isLowStock,
  }: GetInventoryReportUseCaseRequest): Promise<GetInventoryReportUseCaseResponse> {
    const { inventory, meta } =
      await this.medicinesStockRepository.fetchInventory(null, institutionId, {
        stockId,
        medicineName,
        therapeuticClasses,
        isCloseToExpiring,
        isLowStock,
      });

    return right({
      inventory,
      meta: {
        totalCount: meta.totalCount,
      },
    });
  }
}
