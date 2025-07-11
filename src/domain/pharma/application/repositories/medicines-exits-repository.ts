import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineExit, ExitType } from '../../enterprise/entities/exit'
import { MedicineExitDetails } from '../../enterprise/entities/value-objects/medicine-exit-details'
import { Meta, type MetaReport } from '@/core/repositories/meta'
import { Movimentation } from '../../enterprise/entities/value-objects/movimentation'

export abstract class MedicinesExitsRepository {
  abstract create(medicineExit: MedicineExit): Promise<void>
  abstract findMany(
    params: PaginationParams,
    filters: {
      institutionId?: string;
      medicineId?: string;
      operatorId?: string;
      batch?: string;
      exitType?: ExitType;
      exitDate?: Date;
      movementTypeId?: string;
    },
  ): Promise<{ medicinesExits: MedicineExitDetails[]; meta: Meta }>
  abstract fetchMovimentation(
    filters: {
      institutionId: string,
      startDate: Date,
      endDate: Date,
      operatorId?: string,
      medicineId?: string,
      stockId?: string,
      medicineVariantId?: string,
      medicineStockId?: string,
      batcheStockId?: string,
      quantity?: number,
      movementTypeId?: string,
      exitType?: ExitType
    }
  ): Promise<{
    exitsMovimentation: Movimentation[],
    meta: MetaReport;
  }>
}
