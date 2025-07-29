import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineExit, ExitType } from '../../enterprise/entities/exit'
import { Meta } from '@/core/repositories/meta'
import { ExitDetails } from '../../enterprise/entities/value-objects/exit-details'

export abstract class MedicinesExitsRepository {
  abstract create(medicineExit: MedicineExit): Promise<void>
  abstract findMany(
    params: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      exitType?: ExitType;
      exitDate?: Date;
    },
  ): Promise<{ medicinesExits: ExitDetails[]; meta: Meta }>
  // abstract fetchMovimentation(
  //   filters: {
  //     institutionId: string,
  //     startDate: Date,
  //     endDate: Date,
  //     operatorId?: string,
  //     medicineId?: string,
  //     stockId?: string,
  //     medicineVariantId?: string,
  //     medicineStockId?: string,
  //     batcheStockId?: string,
  //     quantity?: number,
  //     movementTypeId?: string,
  //     exitType?: ExitType
  //   }
  // ): Promise<{
  //   exitsMovimentation: Movimentation[],
  //   meta: MetaReport;
  // }>
}
