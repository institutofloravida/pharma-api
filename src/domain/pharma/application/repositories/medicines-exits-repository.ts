import { PaginationParams } from '@/core/repositories/pagination-params'
import { MedicineExit, ExitType } from '../../enterprise/entities/exit'
import { MedicineExitDetails } from '../../enterprise/entities/value-objects/medicine-exit-details'
import { Meta } from '@/core/repositories/meta'

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
}
