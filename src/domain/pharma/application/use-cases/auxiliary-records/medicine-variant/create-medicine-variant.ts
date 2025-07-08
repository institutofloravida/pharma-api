import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'
import { Injectable } from '@nestjs/common'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'

interface createMedicineVariantUseCaseRequest {
  medicineId: string;
  dosage: string;
  pharmaceuticalFormId: string;
  unitMeasureId: string
  complement?: string | null
}

type createMedicineVariantUseCaseResponse = Either<
  ConflictError,
  {
    medicineVariant: MedicineVariant
  }
>

@Injectable()
export class CreateMedicineVariantUseCase {
  constructor(private medicineVariantRepository: MedicinesVariantsRepository) {}
  async execute({
    dosage,
    medicineId,
    pharmaceuticalFormId,
    unitMeasureId,
    complement,
  }: createMedicineVariantUseCaseRequest): Promise<createMedicineVariantUseCaseResponse> {
    const medicineVariant = MedicineVariant.create({
      dosage,
      medicineId: new UniqueEntityId(medicineId),
      pharmaceuticalFormId: new UniqueEntityId(pharmaceuticalFormId),
      unitMeasureId: new UniqueEntityId(unitMeasureId),
      complement,
    })

    const medicineVariantExists = await this.medicineVariantRepository.medicineVariantExists(medicineVariant)
    if (medicineVariantExists) {
      return left(new ConflictError())
    }

    await this.medicineVariantRepository.create(medicineVariant)

    return right({
      medicineVariant,
    })
  }
}
