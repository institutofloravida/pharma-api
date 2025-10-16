import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { MedicinesEntriesRepository } from '../../../repositories/medicines-entries-repository';
import { EntryWithStock } from '@/domain/pharma/enterprise/entities/value-objects/entry-with-stock';

interface FetchRegisterMedicineEntryUseCaseRequest {
  institutionId: string;
  stockId?: string;
  operatorId?: string;
  entryDate?: Date;
  page: number;
}

type FetchRegisterMedicineEntryUseCaseResponse = Either<
  null,
  {
    medicinesEntries: EntryWithStock[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchRegisterMedicinesEntriesUseCase {
  constructor(private medicinesEntriesRepository: MedicinesEntriesRepository) {}

  async execute({
    page,
    institutionId,
    operatorId,
    stockId,
    entryDate,
  }: FetchRegisterMedicineEntryUseCaseRequest): Promise<FetchRegisterMedicineEntryUseCaseResponse> {
    const { entries, meta } = await this.medicinesEntriesRepository.findMany(
      { page },
      {
        institutionId,
        operatorId,
        stockId,
        entryDate,
      },
    );

    return right({
      medicinesEntries: entries,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    });
  }
}
