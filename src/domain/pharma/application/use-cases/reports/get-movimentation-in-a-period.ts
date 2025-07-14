import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MetaReport } from '@/core/repositories/meta'
import { MedicinesEntriesRepository } from '../../repositories/medicines-entries-repository'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { Movimentation } from '@/domain/pharma/enterprise/entities/value-objects/movimentation'
import { MovementDirection } from '@/domain/pharma/enterprise/entities/movement-type'

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
    movimentations: Movimentation[];
    meta: MetaReport;
  }
>

@Injectable()
export class GetMovimentationInAPeriodUseCase {
  constructor(
    private entriesRepository: MedicinesEntriesRepository,
    private exitsRepository: MedicinesExitsRepository,
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
    let entriesMovimentation: Movimentation[] = []
    let exitsMovimentation: Movimentation[] = []
    let metaEntries = { totalCount: 0 }
    let metaExits = { totalCount: 0 }

    if (!direction || direction === 'ENTRY') {
      const result = await this.entriesRepository.fetchMovimentation({
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
        direction,
      })

      entriesMovimentation = result.entriesMovimentation
      metaEntries = result.meta
    }

    if (!direction || direction === 'EXIT') {
      const result = await this.exitsRepository.fetchMovimentation({
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
      })

      exitsMovimentation = result.exitsMovimentation
      metaExits = result.meta
    }

    const movimentationsOrdered: Movimentation[] = [
      ...entriesMovimentation,
      ...exitsMovimentation,
    ].sort((a, b) => b.movementDate.getTime() - a.movementDate.getTime())

    return right({
      movimentations: movimentationsOrdered,
      meta: {
        totalCount: metaEntries.totalCount + metaExits.totalCount,
      },
    })
  }
}
