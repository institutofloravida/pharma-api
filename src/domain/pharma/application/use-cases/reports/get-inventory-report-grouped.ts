import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository';
import { MetaReport } from '@/core/repositories/meta';

interface GetInventoryReportGroupedUseCaseRequest {
  institutionId: string;
  stockId?: string;
  medicineName?: string;
  therapeuticClasses?: string[];
  isLowStock?: boolean;
  includeBatches?: boolean;
}

type GetInventoryReportGroupedUseCaseResponse = Either<
  null,
  {
    stocks: Array<{
      stockId: string;
      stock: string;
      medicines: Array<{
        medicineId: string;
        medicine: string;
        medicineStocks: Array<{
          medicineStockId: string;
          medicineVariantId: string;
          pharmaceuticalForm: string;
          unitMeasure: string;
          dosage: string;
          complement?: string;
          minimumLevel: number;
          quantity: { current: number; available: number; unavailable: number };
          batchesStocks?: Array<{
            id: string;
            code: string;
            currentQuantity: number;
            manufacturer: string;
            expirationDate: Date;
            manufacturingDate: Date | null;
            isCloseToExpiration: boolean;
            isExpired: boolean;
          }>;
        }>;
      }>;
    }>;
    meta: MetaReport;
  }
>;

@Injectable()
export class GetInventoryReportGroupedUseCase {
  constructor(private medicinesStockRepository: MedicinesStockRepository) {}

  async execute({
    institutionId,
    stockId,
    medicineName,
    therapeuticClasses,
    isLowStock,
    includeBatches,
  }: GetInventoryReportGroupedUseCaseRequest): Promise<GetInventoryReportGroupedUseCaseResponse> {
    const { stocks, meta } =
      await this.medicinesStockRepository.fetchInventoryReportGrouped(
        institutionId,
        {
          stockId,
          medicineName,
          therapeuticClasses,
          isLowStock,
        },
        { includeBatches },
      );

    return right({
      stocks,
      meta: {
        totalCount: meta.totalCount,
      },
    });
  }
}
