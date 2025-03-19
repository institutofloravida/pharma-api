import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicineNotFoundError } from './_errors/medicine-not-found-error'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import { MedicineDetails } from '@/domain/pharma/enterprise/entities/value-objects/medicine-details'

interface GetMedicineDetailsUseCaseRequest {
  id: string;
}

type GetMedicineDetailsUseCaseResponse = Either<MedicineNotFoundError, MedicineDetails>

@Injectable()
export class GetMedicineDetailsUseCase {
  constructor(private medicinesRepository: MedicinesRepository) {}

  async execute({
    id,
  }: GetMedicineDetailsUseCaseRequest): Promise<GetMedicineDetailsUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(id)

    if (!medicine) {
      return left(new MedicineNotFoundError(id))
    }

    return right(medicine)
  }
}
