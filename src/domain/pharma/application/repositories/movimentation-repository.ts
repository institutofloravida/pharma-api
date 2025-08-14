import { type Meta } from '@/core/repositories/meta';
import { MovementDirection } from '../../enterprise/entities/movement-type';
import { Movimentation } from '../../enterprise/entities/movimentation';
import { ExitType } from '../../enterprise/entities/exit';
import { MovimentationDetails } from '../../enterprise/entities/value-objects/movimentation-details';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class MovimentationRepository {
  abstract create(movimentation: Movimentation): Promise<void>;

  abstract fetchMovimentation(
    filters: {
      institutionId?: string;
      startDate?: Date;
      endDate?: Date;
      operatorId?: string;
      medicineId?: string;
      stockId?: string;
      medicineVariantId?: string;
      medicineStockId?: string;
      batcheStockId?: string;
      quantity?: number;
      movementTypeId?: string;
      direction?: MovementDirection;
      exitId?: string;
      entryId?: string;
      exitType?: ExitType;
    },
    params?: PaginationParams,
  ): Promise<{
    movimentation: MovimentationDetails[];
    meta: Meta;
  }>;
}
