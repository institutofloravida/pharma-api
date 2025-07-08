import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MedicineVariant } from '@/domain/pharma/enterprise/entities/medicine-variant'
import { MedicineVariantAlreadyExistsError } from './_errors/medicine-variant-already-exists-error'
import { MedicineVariantNotFoundError } from './_errors/medicine-variant-not-found-error'
import { MedicinesVariantsRepository } from '../../../repositories/medicine-variant-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface updateMedicineVariantUseCaseRequest {
  medicineVariantId: string;
  dosage?: string;
  pharmaceuticalFormId?: string;
  unitMeasureId?: string;
  complement?: string

}

type updateMedicineVariantUseCaseResponse = Either<
  MedicineVariantAlreadyExistsError | MedicineVariantNotFoundError,
  {
    medicinevariant: MedicineVariant;
  }
>

@Injectable()
export class UpdateMedicineVariantUseCase {
  constructor(
    private medicinesVariantsRepository: MedicinesVariantsRepository,
  ) {}

  async execute({
    medicineVariantId,
    dosage,
    pharmaceuticalFormId,
    unitMeasureId,
    complement,
  }: updateMedicineVariantUseCaseRequest): Promise<updateMedicineVariantUseCaseResponse> {
    const medicineVariant =
      await this.medicinesVariantsRepository.findById(medicineVariantId)

    if (!medicineVariant) {
      return left(new MedicineVariantNotFoundError(medicineVariantId))
    }

    if (pharmaceuticalFormId && unitMeasureId && dosage) {
      const medicineVariantExists =
      await this.medicinesVariantsRepository.medicineVariantExists(
        MedicineVariant.create({
          medicineId: medicineVariant.medicineId,
          dosage,
          pharmaceuticalFormId: new UniqueEntityId(
            pharmaceuticalFormId,
          ),
          unitMeasureId: new UniqueEntityId(
            unitMeasureId,
          ),
        }),
      )

      if (medicineVariantExists && !medicineVariantExists.id.equal(medicineVariant.id)) {
        return left(new MedicineVariantAlreadyExistsError())
      }
    }

    if (dosage) {
      medicineVariant.dosage = dosage
    }

    if (pharmaceuticalFormId) {
      medicineVariant.pharmaceuticalFormId = new UniqueEntityId(
        pharmaceuticalFormId,
      )
    }

    if (unitMeasureId) {
      medicineVariant.unitMeasureId = new UniqueEntityId(unitMeasureId)
    }

    if (complement) {
      medicineVariant.complement = complement
    }

    await this.medicinesVariantsRepository.save(medicineVariant)

    return right({
      medicinevariant: medicineVariant,
    })
  }
}
