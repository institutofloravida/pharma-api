import { Either, left, right } from '@/core/either'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { Injectable } from '@nestjs/common'
import { MedicineNotFoundError } from './_errors/medicine-not-found-error'
import { MedicinesRepository } from '../../../repositories/medicines-repository'

interface GetMedicineUseCaseRequest {
  id: string;
}

type GetMedicineUseCaseResponse = Either<MedicineNotFoundError, Medicine>

@Injectable()
export class GetMedicineUseCase {
  constructor(private medicinesRepository: MedicinesRepository) {}

  async execute({
    id,
  }: GetMedicineUseCaseRequest): Promise<GetMedicineUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(id)

    if (!medicine) {
      return left(new MedicineNotFoundError(id))
    }

    return right(medicine)
  }
}
