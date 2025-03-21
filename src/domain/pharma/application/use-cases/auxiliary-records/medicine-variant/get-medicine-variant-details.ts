import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicineVariantNotFoundError } from './_errors/medicine-variant-not-found-error'
import { MedicineVariantWithMedicine } from '@/domain/pharma/enterprise/entities/value-objects/medicine-variant-with-medicine'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'

interface GetMedicineVariantDetailsUseCaseRequest {
  id: string;
}

type GetMedicineVariantDetailsUseCaseResponse = Either<
  MedicineVariantNotFoundError,
  MedicineVariantWithMedicine
>

@Injectable()
export class GetMedicineVariantDetailsUseCase {
  constructor(private medicinesVariantsRepository: MedicinesVariantsRepository) {}

  async execute({
    id,
  }: GetMedicineVariantDetailsUseCaseRequest): Promise<GetMedicineVariantDetailsUseCaseResponse> {
    const medicinevariant =
      await this.medicinesVariantsRepository.findByIdWithDetails(id)

    if (!medicinevariant) {
      return left(new MedicineVariantNotFoundError(id))
    }

    return right(medicinevariant)
  }
}
