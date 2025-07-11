import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MetaReport } from '@/core/repositories/meta'
import { MedicinesEntriesRepository } from '../../repositories/medicines-entries-repository'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { Movimentation } from '@/domain/pharma/enterprise/entities/value-objects/movimentation'

interface GetMovimentationInAPeriodUseCaseRequest {
  institutionId: string;
  startDate: Date;
  endDate: Date;
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
  }: GetMovimentationInAPeriodUseCaseRequest): Promise<GetMovimentationInAPeriodUseCaseResponse> {
    const { entriesMovimentation, meta: metaEntries } =
      await this.entriesRepository.fetchMovimentation({
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
      })

    const { exitsMovimentation, meta: metaExits } =
      await this.exitsRepository.fetchMovimentation({
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
