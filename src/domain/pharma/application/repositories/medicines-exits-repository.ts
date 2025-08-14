import { PaginationParams } from '@/core/repositories/pagination-params';
import { MedicineExit, ExitType } from '../../enterprise/entities/exit';
import { Meta } from '@/core/repositories/meta';
import { ExitDetails } from '../../enterprise/entities/value-objects/exit-details';

export abstract class MedicinesExitsRepository {
  abstract create(medicineExit: MedicineExit): Promise<void>;
  abstract findByIdWithDetails(id: string): Promise<ExitDetails | null>;
  abstract findById(id: string): Promise<MedicineExit | null>;
  abstract findByTransferId(transferId: string): Promise<MedicineExit | null>;
  abstract save(medicineExit: MedicineExit): Promise<void>;
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
