import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'

interface FetchMedicinesVariantsUseCaseRequest {
  medicineId: string;
  page: number;
}

type FetchMedicinesVariantsUseCaseResponse = Either<
  null,
  {
    medicinesVariants: MedicineVariantWithMedicine[];
  }
>

@Injectable()
export class FetchMedicinesVariantsUseCase {
  constructor(
    private MedicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({
    page,
    medicineId,
  }: FetchMedicinesVariantsUseCaseRequest): Promise<FetchMedicinesVariantsUseCaseResponse> {
    const medicinesVariants =
      await this.MedicinesVariantsRepository.findManyByMedicineIdWithMedicine(
        medicineId,
        { page },
      )

    return right({
      medicinesVariants,
    })
  }
}
