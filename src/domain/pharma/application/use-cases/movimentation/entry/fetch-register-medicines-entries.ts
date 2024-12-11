import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { MedicineEntryWithMedicineVariantAndBatch } from '@/domain/pharma/enterprise/entities/value-objects/medicine-entry-with-medicine-batch-stock'
import { MedicinesEntriesRepository } from '../../../repositories/medicines-entries-repository'

interface FetchRegisterMedicineEntryUseCaseRequest {
  institutionId: string,
  medicineId?: string;
  medicineVariantId?: string;
  stockId?: string;
  operatorId?: string;
  page: number;
}

type FetchRegisterMedicineEntryUseCaseResponse = Either<
  null,
  {
    medicinesEntries: MedicineEntryWithMedicineVariantAndBatch[],
    meta: Meta
  }
>

@Injectable()
export class FetchRegisterMedicinesEntriesUseCase {
  constructor(
    private medicinesEntriesRepository: MedicinesEntriesRepository,
  ) {}

  async execute({
    page,
    institutionId,
    operatorId,
    stockId,
    medicineId,
    medicineVariantId,
  }: FetchRegisterMedicineEntryUseCaseRequest): Promise<FetchRegisterMedicineEntryUseCaseResponse> {
    const { medicinesEntries, meta } =
      await this.medicinesEntriesRepository.findManyByInstitutionId(
        { page },
        institutionId,
        operatorId,
        stockId,
        medicineId,
        medicineVariantId,
      )

    return right({
      medicinesEntries,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    })
  }
}
