import { left, right, type Either } from '@/core/either'
import { Medicine } from '../../../../enterprise/entities/medicine'
import { Injectable } from '@nestjs/common'
import { MedicineNotFoundError } from './_errors/medicine-not-found-error'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import { MedicineAlreadyExistsError } from './_errors/medicine-already-exists-error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface updateMedicineUseCaseRequest {
  medicineId: string;
  content?: string;
  description?: string;
  therapeuticClassesIds?: string[]
}

type updateMedicineUseCaseResponse = Either<
  MedicineAlreadyExistsError | MedicineNotFoundError,
  {
    medicine: Medicine;
  }
>

@Injectable()
export class UpdateMedicineUseCase {
  constructor(private medicinesRepository: MedicinesRepository) {}
  async execute({
    medicineId,
    content,
    description,
    therapeuticClassesIds,
  }: updateMedicineUseCaseRequest): Promise<updateMedicineUseCaseResponse> {
    const medicine = await this.medicinesRepository.findById(medicineId)

    if (!medicine) {
      return left(new MedicineNotFoundError(medicineId))
    }

    if (content) {
      const medicineWithSameContent =
        await this.medicinesRepository.findByName(content)
      if (
        medicineWithSameContent &&
        !medicine.id.equal(medicineWithSameContent.id)
      ) {
        return left(new MedicineAlreadyExistsError(content))
      }

      medicine.content = content
    }

    if (description) {
      medicine.description = description
    }

    if (therapeuticClassesIds) {
      medicine.therapeuticClassesIds = therapeuticClassesIds.map((id) => new UniqueEntityId(id))
    }

    await this.medicinesRepository.save(medicine)

    return right({
      medicine,
    })
  }
}
