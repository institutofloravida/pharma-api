import { type Meta } from '@/core/repositories/meta';
import { MovementDirection } from '../../enterprise/entities/movement-type';
import { Movimentation } from '../../enterprise/entities/movimentation';
import { ExitType } from '../../enterprise/entities/exit';
import { MovimentationDetails } from '../../enterprise/entities/value-objects/movimentation-details';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class MovimentationRepository {
  abstract create(movimentation: Movimentation): Promise<void>;

  /**
   * Retorna um Map de batchStockId → delta acumulado de todas as correções
   * feitas sobre a entrada original (positivo = entrada, negativo = saída).
   */
  abstract fetchCorrectionDeltas(
    originalEntryId: string,
  ): Promise<Map<string, number>>;

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
