import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { ExitWithStock } from '@/domain/pharma/enterprise/entities/value-objects/exit-with-stock';

interface FetchMedicineExitUseCaseRequest {
  page: number;
  institutionId: string;
  operatorId?: string;
  exitType?: ExitType;
  exitDate?: Date;
}

type FetchMedicineExitUseCaseResponse = Either<
  null,
  {
    medicinesExits: ExitWithStock[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchMedicinesExitsUseCase {
  constructor(private medicinesExitsRepository: MedicinesExitsRepository) {}

  async execute({
    page,
    institutionId,
    operatorId,
    exitDate,
    exitType,
  }: FetchMedicineExitUseCaseRequest): Promise<FetchMedicineExitUseCaseResponse> {
    const { medicinesExits, meta } =
      await this.medicinesExitsRepository.findMany(
        { page },
        {
          exitDate,
          exitType,
          institutionId,
          operatorId,
        },
      );

    return right({
      medicinesExits,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    });
  }
}
