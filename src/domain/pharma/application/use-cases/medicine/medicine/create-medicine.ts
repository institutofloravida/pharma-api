import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Medicine } from '../../../../enterprise/entities/medicine'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface createMedicineUseCaseRequest {
  content: string,
  description?: string | null
  therapeuticClassesIds: UniqueEntityId[]
  medicinesVariantsIds?: UniqueEntityId[]
}

type createMedicineUseCaseResponse = Either<
  ConflictError,
  {
    medicine: Medicine
  }
>

@Injectable()
export class CreateMedicineUseCase {
  constructor(private medicineRepository: MedicinesRepository) {}
  async execute({
    content,
    description,
    therapeuticClassesIds,
    medicinesVariantsIds,
  }: createMedicineUseCaseRequest): Promise<createMedicineUseCaseResponse> {
    const medicine = Medicine.create({
      content,
      description,
      therapeuticClassesIds,
      medicinesVariantsIds,
    })

    const contentExists = await this.medicineRepository.medicineExists(medicine)
    if (contentExists) {
      return left(new ConflictError())
    }

    await this.medicineRepository.create(medicine)

    return right({
      medicine,
    })
  }
}
