import { PaginationParams } from '@/core/repositories/pagination-params';
import { MedicineExit, ExitType } from '../../enterprise/entities/exit';
import { Meta } from '@/core/repositories/meta';
import { ExitDetails } from '../../enterprise/entities/value-objects/exit-details';

export abstract class MedicinesExitsRepository {
  abstract create(medicineExit: MedicineExit): Promise<void>;
  abstract findById(id: string): Promise<ExitDetails | null>;
  abstract findByTransferId(transferId: string): Promise<MedicineExit | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      institutionId: string;
      operatorId?: string;
      exitType?: ExitType;
      exitDate?: Date;
    },
  ): Promise<{ medicinesExits: ExitDetails[]; meta: Meta }>;
}
