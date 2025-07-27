import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MetaReport } from '@/core/repositories/meta'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'

import { MovementDirection } from '@/domain/pharma/enterprise/entities/movement-type'
import type { MovimentationRepository } from '../../repositories/movimentation-repository'
import type { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details'

interface GetMovimentationInAPeriodUseCaseRequest {
  institutionId: string;
  startDate: Date;
  endDate: Date;
  direction?: MovementDirection
  operatorId?: string;
  medicineId?: string;
  medicineVariantId?: string;
  stockId?: string
  medicineStockId?: string;
  batcheStockId?: string;
  quantity?: number;
  movementTypeId?: string;
  exitType?: ExitType;
}

type GetMovimentationInAPeriodUseCaseResponse = Either<
  null,
  {
    movimentation: MovimentationDetails[];
    meta: MetaReport;
  }
>

@Injectable()
export class GetMovimentationInAPeriodUseCase {
  constructor(
    private movimentationRepository: MovimentationRepository,
  ) {}

  async execute({
    institutionId,
    endDate,
    startDate,
    operatorId,
    batcheStockId,
    exitType,
    medicineId,
    stockId,
    medicineStockId,
    medicineVariantId,
    movementTypeId,
    quantity,
    direction,
  }: GetMovimentationInAPeriodUseCaseRequest): Promise<GetMovimentationInAPeriodUseCaseResponse> {
    const { movimentation, meta } = await this.movimentationRepository.fetchMovimentation({
      institutionId,
      startDate,
      endDate,
      medicineId,
      medicineVariantId,
      stockId,
      medicineStockId,
      batcheStockId,
      movementTypeId,
      operatorId,
      quantity,
      exitType,
      direction,
    })

    return right({
      movimentation,
      meta: {
        totalCount: meta.totalCount,
      },
    })
  }
}
