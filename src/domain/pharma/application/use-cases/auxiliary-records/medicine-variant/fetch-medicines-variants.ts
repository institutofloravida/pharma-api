import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchMedicinesVariantsUseCaseRequest {
  medicineId?: string;
  page: number;
  content?: string
}

type FetchMedicinesVariantsUseCaseResponse = Either<
  null,
  {
    medicinesVariants: MedicineVariantWithMedicine[],
    meta: Meta
  }
>

@Injectable()
export class FetchMedicinesVariantsUseCase {
  constructor(
    private MedicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({
    medicineId,
    page,
    content,
  }: FetchMedicinesVariantsUseCaseRequest): Promise<FetchMedicinesVariantsUseCaseResponse> {
    const { medicinesVariants, meta } =
      await this.MedicinesVariantsRepository.findMany(
        { page },
        { medicineId, content },
      )

    return right({
      medicinesVariants,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    })
  }
}
