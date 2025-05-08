import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository'
import { MedicineExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-exit-details'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'

interface FetchMedicineExitUseCaseRequest {
  page: number;
  institutionId: string;
  medicineId?: string;
  operatorId?: string;
  batch?: string;
  exitType?: ExitType;
  exitDate?: Date;
  movementTypeId?: string;
}

type FetchMedicineExitUseCaseResponse = Either<
  null,
  {
    medicinesExits: MedicineExitDetails[];
    meta: Meta;
  }
>

@Injectable()
export class FetchMedicinesExitsUseCase {
  constructor(private medicinesExitsRepository: MedicinesExitsRepository) {}

  async execute({
    page,
    institutionId,
    operatorId,
    batch,
    exitDate,
    exitType,
    medicineId,
    movementTypeId,
  }: FetchMedicineExitUseCaseRequest): Promise<FetchMedicineExitUseCaseResponse> {
    const { medicinesExits, meta } =
      await this.medicinesExitsRepository.findMany(
        { page },
        {
          batch,
          exitDate,
          exitType,
          institutionId,
          medicineId,
          movementTypeId,
          operatorId,
        },
      )

    return right({
      medicinesExits,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    })
  }
}
